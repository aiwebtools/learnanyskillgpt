
import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';
import GlassMorphism from './ui/GlassMorphism';

const CTA: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden" role="region" aria-labelledby="cta-heading">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-2xl opacity-30"></div>
      
      <div className="flex justify-center mb-8">
        <Button 
          size="lg" 
          className="px-8 py-6 text-lg font-semibold bg-gray-800 hover:bg-gray-700 rounded-md shadow-lg transition-all"
          onClick={() => window.open('https://www.aiwebtools.ai', '_blank')}
          aria-label="Explore AiWebTools.AI - Free AI Tools Collection"
        >
          Explore AiWebTools.AI - Free AI Tools
        </Button>
      </div>
      
      <div className="section-container relative z-10">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <GlassMorphism className="px-6 py-12 md:py-16">
            <span className="chip mb-6">Ready to Start Learning with Free AI Tools?</span>
            <h2 id="cta-heading" className="heading text-3xl md:text-4xl lg:text-5xl mb-6 text-gray-900">
              Master Any Skill With AI-Guided Learning - Completely Free
            </h2>
            <p className="text-lg mx-auto mb-8 max-w-2xl text-gray-800 font-medium">
              Whether you want to learn photography, coding, cooking, or any other skill, Learn Any Skill GPT provides personalized instruction with curated YouTube videos and visual aids. Join thousands using our free AI tools for education.
            </p>
            
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base w-full md:w-auto"
                onClick={() => window.open('https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt', '_blank')}
                aria-label="Start learning now with Learn Any Skill GPT free AI tool"
              >
                Start Learning Now - Free AI Tool
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 py-6 text-base w-full md:w-auto"
                onClick={() => window.open('https://www.AiWebTools.Ai', '_blank')}
                aria-label="Explore more free AI tools at AiWebTools.AI"
              >
                Explore More Free AI Tools
              </Button>
            </div>
          </GlassMorphism>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTA;
