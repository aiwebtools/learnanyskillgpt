import React, { useState } from 'react';
import { Download, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { streamImage } from '@/lib/stream-image';

const sizes = [
  { label: 'Square', value: '1024x1024' },
  { label: 'Wide', value: '1536x1024' },
  { label: 'Portrait', value: '1024x1536' },
];

async function addBrandMark(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) return reject(new Error('Could not prepare the final image.'));
      context.drawImage(image, 0, 0);
      const fontSize = Math.max(18, Math.round(canvas.width * 0.022));
      context.font = `600 ${fontSize}px system-ui, sans-serif`;
      const text = 'AiWebTools.AI';
      const padding = Math.round(fontSize * 0.65);
      const boxWidth = context.measureText(text).width + padding * 2;
      const boxHeight = fontSize + padding * 1.5;
      const x = canvas.width - boxWidth - padding;
      const y = canvas.height - boxHeight - padding;
      context.fillStyle = 'rgba(10, 15, 28, 0.82)';
      context.beginPath();
      context.roundRect(x, y, boxWidth, boxHeight, Math.round(fontSize * 0.35));
      context.fill();
      context.fillStyle = '#ffffff';
      context.textBaseline = 'middle';
      context.fillText(text, x + padding, y + boxHeight / 2);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => reject(new Error('Could not prepare the final image.'));
    image.src = dataUrl;
  });
}

const ImageCreator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [imageUrl, setImageUrl] = useState<string>();
  const [isFinal, setIsFinal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const createImage = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isGenerating) return;
    setError('');
    setImageUrl(undefined);
    setIsFinal(false);
    setIsGenerating(true);

    try {
      let finalImage = '';
      const projectUrl = import.meta.env.VITE_SUPABASE_URL;
      const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if (!projectUrl || !publishableKey) throw new Error('Image creation is not configured yet.');
      const { data } = await supabase.auth.getSession();
      const authToken = data.session?.access_token ?? publishableKey;
      await streamImage(
        `${projectUrl}/functions/v1/generate-learning-image`,
        { prompt: trimmedPrompt, size },
        (nextImage, finalFrame) => {
          setImageUrl(nextImage);
          setIsFinal(finalFrame);
          if (finalFrame) finalImage = nextImage;
        },
        { apikey: publishableKey, Authorization: `Bearer ${authToken}` },
      );
      if (finalImage) {
        const brandedImage = await addBrandMark(finalImage);
        setImageUrl(brandedImage);
        setIsFinal(true);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Image creation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl || !isFinal) return;
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'aiwebtools-learning-image.png';
      link.click();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Download failed.');
    }
  };

  return (
    <section id="image-creator" className="bg-secondary/30 py-14 sm:py-20" aria-labelledby="image-creator-heading">
      <div className="section-container py-0">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="min-w-0 text-left">
            <span className="chip mb-4"><Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />Built-in image creator</span>
            <h2 id="image-creator-heading" className="heading mb-4 text-3xl text-foreground sm:text-4xl">Create visuals for anything you’re learning</h2>
            <p className="mb-6 max-w-xl text-muted-foreground">Describe a diagram, concept illustration, study aid, or creative visual. Your finished image includes the AiWebTools.AI mark and is ready to download.</p>
            <label htmlFor="image-prompt" className="mb-2 block text-sm font-semibold text-foreground">Describe your image</label>
            <textarea
              id="image-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              maxLength={2000}
              rows={5}
              placeholder="Example: A clear educational diagram showing how a camera aperture controls depth of field"
              className="w-full resize-y rounded-md border border-input bg-background px-4 py-3 text-base text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full rounded-md border border-border p-1 sm:w-auto" aria-label="Image shape">
                {sizes.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={size === option.value ? 'default' : 'ghost'}
                    className="min-w-0 flex-1 px-3 sm:flex-none"
                    onClick={() => setSize(option.value)}
                    aria-pressed={size === option.value}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Button type="button" size="lg" className="w-full whitespace-normal sm:w-auto" onClick={createImage} disabled={!prompt.trim() || isGenerating}>
                {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
                {isGenerating ? 'Creating your image…' : 'Generate image'}
              </Button>
            </div>
            {error && <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}
          </div>

          <div className="flex min-h-[320px] min-w-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background p-3 sm:min-h-[440px]">
            {imageUrl ? (
              <div className="relative w-full">
                <img src={imageUrl} alt={`AI-generated visual: ${prompt}`} className={`mx-auto max-h-[620px] w-full rounded-md object-contain transition-[filter] duration-500 ${isFinal ? 'blur-0' : 'blur-xl'}`} />
                {isFinal && !isGenerating && (
                  <Button type="button" size="sm" className="absolute bottom-3 right-3" onClick={downloadImage}>
                    <Download className="h-4 w-4" aria-hidden="true" /> Download
                  </Button>
                )}
              </div>
            ) : (
              <div className="px-6 text-center text-muted-foreground">
                <ImageIcon className="mx-auto mb-3 h-12 w-12 text-primary" aria-hidden="true" />
                <p className="font-medium text-foreground">Your image will appear here</p>
                <p className="mt-1 text-sm">Choose a shape, describe what you need, then generate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCreator;
