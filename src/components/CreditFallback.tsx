import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassMorphism from './ui/GlassMorphism';

const CreditFallback: React.FC = () => {
  return (
    <section className="py-16 bg-secondary/30" role="region" aria-labelledby="credit-fallback-heading">
      <div className="section-container py-0">
        <GlassMorphism variant="dark" intensity="high" className="max-w-4xl mx-auto p-6 md:p-8 text-center border-primary/30">
          <span className="chip mb-4">Backup Access</span>
          <h2 id="credit-fallback-heading" className="heading text-2xl md:text-3xl mb-3 text-white">
            If community credits run out today
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-6">
            Sorry, community credits may be temporarily unavailable. Please try the ChatGPT version below so you can keep learning without waiting.
          </p>
          <Button size="lg" className="rounded-full px-6 py-6 text-base font-semibold" asChild>
            <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer" aria-label="Open Learn Any Skill GPT ChatGPT version if community credits are out">
              Try Learn Any Skill GPT (ChatGPT version) <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </Button>
        </GlassMorphism>
      </div>
    </section>
  );
};

export default CreditFallback;
