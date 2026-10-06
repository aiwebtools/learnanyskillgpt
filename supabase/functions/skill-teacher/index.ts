const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY = "https://ai.gateway.lovable.dev";
const CHAT_MODEL = "openai/gpt-6-astra";
const TTS_MODEL = "google/gemini-3.1-flash-tts-preview";
const STT_MODEL = "openai/gpt-transcribe";

const TEACHER_INSTRUCTIONS = `You are "Learn Any Skill GPT", presented by AiWebTools.AI. You teach any skill from beginning to end.
Method:
1. If the learner hasn't said their current level and goal, briefly ask (one short question), otherwise start teaching.
2. Build a clear step-by-step learning path (beginner -> intermediate -> advanced) and teach one lesson at a time.
3. Each lesson: a short title, a plain-language explanation, a concrete example, a hands-on practice exercise, and 2-3 quick check questions.
4. Suggest helpful YouTube search phrases for the topic when visual demonstration helps.
5. Encourage the learner, adapt to their answers, and end each lesson by offering the next step.
Use clean Markdown with headings and bullet lists. Keep each reply focused and under about 600 words.`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function passError(upstream: Response) {
  const text = await upstream.text().catch(() => "");
  let message = text;
  try {
    const parsed = JSON.parse(text);
    message = parsed?.error?.message ?? parsed?.message ?? text;
  } catch { /* keep text */ }
  if (upstream.status === 402) message = "Community AI credits have run out for today. Please try the CHATGPT version.";
  if (upstream.status === 429) message = "The teacher is busy right now. Please wait a moment and try again.";
  return json({ error: { message: message || "The AI service failed." } }, upstream.status);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: { message: "Method not allowed" } }, 405);
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: { message: "AI is not configured yet." } }, 500);

  try {
    const contentType = req.headers.get("content-type") ?? "";

    // Speech to text
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File) || file.size === 0) return json({ error: { message: "No recording received." } }, 400);
      if (file.size > 20 * 1024 * 1024) return json({ error: { message: "Recording is too long. Please keep it under a few minutes." } }, 400);
      const out = new FormData();
      out.append("file", file, file.name || "recording.webm");
      out.append("model", STT_MODEL);
      const upstream = await fetch(`${GATEWAY}/v1/audio/transcriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: out,
      });
      if (!upstream.ok) return passError(upstream);
      const data = await upstream.json();
      return json({ text: data.text ?? "" });
    }

    const body = await req.json();

    // Text to speech (returns a complete WAV file)
    if (body.action === "tts") {
      const text = typeof body.text === "string" ? body.text.trim() : "";
      if (!text) return json({ error: { message: "Nothing to read aloud." } }, 400);
      if (text.length > 4000) return json({ error: { message: "Text chunk too long." } }, 400);
      const upstream = await fetch(`${GATEWAY}/v1/audio/speech`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: TTS_MODEL,
          contents: [{ parts: [{ text: `Read this lesson in a warm, clear, encouraging teacher voice: ${text}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
          },
        }),
      });
      if (!upstream.ok) return passError(upstream);
      return new Response(upstream.body, {
        headers: { ...corsHeaders, "Content-Type": upstream.headers.get("Content-Type") ?? "audio/wav" },
      });
    }

    // Chat (streamed)
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const clean = messages
      .filter((m: any) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string" && m.content.trim())
      .slice(-30)
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 8000) }));
    if (!clean.length || clean[clean.length - 1].role !== "user") return json({ error: { message: "Send a message to start." } }, 400);

    const upstream = await fetch(`${GATEWAY}/v1/responses`, {
      method: "POST",
      signal: req.signal,
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: CHAT_MODEL,
        instructions: TEACHER_INSTRUCTIONS,
        input: clean,
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
      }),
    });
    if (!upstream.ok) return passError(upstream);
    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (error) {
    return json({ error: { message: error instanceof Error ? error.message : "Something went wrong." } }, 500);
  }
});
