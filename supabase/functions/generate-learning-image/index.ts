import { generateImage } from "../_shared/image-generation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const imageSettings = {
  baseURL: "https://ai.gateway.lovable.dev",
  model: "openai/gpt-image-2.5-sunburst",
};

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const body = await req.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const size = ["1024x1024", "1536x1024", "1024x1536"].includes(body.size)
      ? body.size
      : "1024x1024";
    const stream = body.stream !== false;

    if (!prompt) return errorResponse("Describe the image you want to create.", 400);
    if (prompt.length > 2000) return errorResponse("Please keep your description under 2,000 characters.", 400);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return errorResponse("Image creation is not configured yet.", 500);

    const enhancedPrompt = `${prompt}\n\nCreate a polished, educationally useful image. Leave the lower-right corner visually simple for an AiWebTools.AI brand mark. Do not add any other logos or watermarks.`;
    let upstream = await generateImage({ ...imageSettings, apiKey }, enhancedPrompt, size, stream);

    if (!stream && (upstream.status === 429 || upstream.status >= 500)) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      upstream = await generateImage({ ...imageSettings, apiKey }, enhancedPrompt, size, stream);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image creation failed.";
    return errorResponse(message, 500);
  }
});
