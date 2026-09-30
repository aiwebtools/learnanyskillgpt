export type ImageConfig = {
  baseURL: string;
  apiKey: string;
  model: string;
};

export function generateImage(
  config: ImageConfig,
  prompt: string,
  size: string,
  stream = true,
) {
  return fetch(`${config.baseURL}/v1/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      prompt,
      size,
      quality: "medium",
      ...(stream ? { stream: true, partial_images: 1 } : {}),
    }),
  });
}
