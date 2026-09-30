import { createParser } from "eventsource-parser";
import { flushSync } from "react-dom";

type ImagePayload = { type?: string; b64_json?: string; error?: { message?: string } };

export async function streamImage(
  endpoint: string,
  input: Record<string, unknown>,
  onFrame: (dataUrl: string, isFinal: boolean) => void,
  headers?: HeadersInit,
): Promise<void> {
  const send = (stream: boolean) => {
    const requestHeaders = new Headers(headers);
    requestHeaders.set("Content-Type", "application/json");
    return fetch(endpoint, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ ...input, stream }),
    });
  };

  const response = await send(true);
  if (!response.ok || !response.body) {
    const body = await response.text().catch(() => "");
    let message = body;
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
      message = parsed.error?.message ?? parsed.message ?? body;
    } catch {
      // Keep the safe server response text.
    }
    throw new Error(message || `Image creation failed (${response.status}).`);
  }

  let sawCompleted = false;
  let sawAnyEvent = false;
  let streamError: string | undefined;
  const parser = createParser({
    onEvent(event) {
      let payload: ImagePayload | undefined;
      try {
        payload = JSON.parse(event.data) as ImagePayload;
      } catch {
        return;
      }
      if (event.event === "error" || payload.type === "error") {
        sawAnyEvent = true;
        streamError = payload.error?.message ?? "Image creation failed.";
        return;
      }
      const type = event.event || payload.type;
      if (type !== "image_generation.partial_image" && type !== "image_generation.completed") return;
      sawAnyEvent = true;
      if (!payload.b64_json) {
        streamError = "The image service returned an empty image.";
        return;
      }
      const isFinal = type === "image_generation.completed";
      flushSync(() => onFrame(`data:image/png;base64,${payload?.b64_json}`, isFinal));
      if (isFinal) sawCompleted = true;
    },
  });

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  try {
    while (true) {
      let chunk: ReadableStreamReadResult<string>;
      try {
        chunk = await reader.read();
      } catch (error) {
        if (sawAnyEvent) throw error;
        break;
      }
      if (chunk.done) break;
      parser.feed(chunk.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }

  if (streamError) throw new Error(streamError);
  if (!sawAnyEvent) {
    const replay = await send(false);
    if (!replay.ok) {
      const body = await replay.text().catch(() => "");
      throw new Error(body || `Image creation failed (${replay.status}).`);
    }
    const json = (await replay.json()) as { data?: { b64_json?: string }[] };
    const base64 = json.data?.[0]?.b64_json;
    if (!base64) throw new Error("Image creation returned no image.");
    onFrame(`data:image/png;base64,${base64}`, true);
    return;
  }
  if (!sawCompleted) throw new Error("Image creation ended before the final image was ready.");
}
