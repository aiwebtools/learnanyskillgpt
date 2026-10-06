import { createParser } from "eventsource-parser";

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/skill-teacher`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const baseHeaders = { apikey: KEY };

export type ChatMessage = { role: "user" | "assistant"; content: string };

async function readError(res: Response) {
  const text = await res.text().catch(() => "");
  try {
    const parsed = JSON.parse(text);
    return parsed?.error?.message ?? parsed?.message ?? text;
  } catch {
    return text || `Request failed (${res.status}).`;
  }
}

export async function streamTeacher(messages: ChatMessage[], onDelta: (text: string) => void, signal?: AbortSignal) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { ...baseHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(await readError(res));
  let failure: string | undefined;
  let completed = false;
  const parser = createParser({
    onEvent(event) {
      let data: any;
      try { data = JSON.parse(event.data); } catch { return; }
      const type = data.type ?? event.event;
      if (type === "response.output_text.delta" && typeof data.delta === "string") onDelta(data.delta);
      else if (type === "response.completed") completed = true;
      else if (type === "response.failed" || type === "error" || type === "response.incomplete")
        failure = data.error?.message ?? data.response?.error?.message ?? "The teacher could not finish this reply.";
    },
  });
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    parser.feed(value);
  }
  if (failure) throw new Error(failure);
  if (!completed) throw new Error("The reply was interrupted. Please try again.");
}

export async function transcribe(blob: Blob): Promise<string> {
  const form = new FormData();
  const ext = blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm";
  form.append("file", blob, `recording.${ext}`);
  const res = await fetch(ENDPOINT, { method: "POST", headers: baseHeaders, body: form });
  if (!res.ok) throw new Error(await readError(res));
  const data = await res.json();
  return (data.text ?? "").trim();
}

export function toPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_`>]+/g, "")
    .replace(/^\s*[-+]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function chunkText(text: string, max = 1200) {
  const parts: string[] = [];
  let current = "";
  for (const sentence of text.split(/(?<=[.!?\n])\s+/)) {
    if ((current + " " + sentence).length > max && current) {
      parts.push(current.trim());
      current = "";
    }
    current += " " + sentence;
  }
  if (current.trim()) parts.push(current.trim());
  return parts.flatMap((p) => (p.length > max ? p.match(new RegExp(`.{1,${max}}`, "gs")) ?? [] : [p]));
}

function pcmFromWav(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  let offset = 12;
  while (offset < view.byteLength - 8) {
    const id = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3));
    const size = view.getUint32(offset + 4, true);
    if (id === "data") return new Uint8Array(buffer, offset + 8, Math.min(size, view.byteLength - offset - 8));
    offset += 8 + size;
  }
  return new Uint8Array(buffer, 44);
}

function wavFromPcm(chunks: Uint8Array[], sampleRate = 24000) {
  const length = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(44 + length);
  const v = new DataView(out.buffer);
  const w = (o: number, s: string) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + length, true); w(8, "WAVE"); w(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, length, true);
  let pos = 44;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  return new Blob([out], { type: "audio/wav" });
}

export async function synthesize(markdown: string, onProgress?: (done: number, total: number) => void): Promise<Blob> {
  const pieces = chunkText(toPlainText(markdown));
  const pcm: Uint8Array[] = [];
  for (let i = 0; i < pieces.length; i++) {
    onProgress?.(i, pieces.length);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { ...baseHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "tts", text: pieces[i] }),
    });
    if (!res.ok) throw new Error(await readError(res));
    pcm.push(pcmFromWav(await res.arrayBuffer()));
  }
  onProgress?.(pieces.length, pieces.length);
  return wavFromPcm(pcm);
}
