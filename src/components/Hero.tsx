
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import GlassMorphism from './ui/GlassMorphism';
import AnimatedSection from './AnimatedSection';

const Hero: React.FC = () => {
  // Start with video automatically playing
  const [videoPlaying, setVideoPlaying] = useState(true);
  
  // Auto-play video when component mounts
  useEffect(() => {
    setVideoPlaying(true);
  }, []);

  return (
    <section id="main-content" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-starry-night py-16 md:py-20" role="banner">
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      <div className="starry-background absolute inset-0"></div>
      
      <div className="absolute top-40 left-10 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-40 right-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="section-container relative z-10 flex flex-col items-center justify-center">
        <AnimatedSection animation="fade-in-down" className="mb-6">
          <span className="chip bg-white/20 text-white font-medium">Free AI Tools by AiWebTools.AI</span>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-in" className="text-center mb-6">
          <h1 className="heading text-4xl md:text-6xl lg:text-7xl mb-6 max-w-4xl font-bold text-white drop-shadow-md">
            Master Any Skill from Beginner to Expert with Free AI Tools
          </h1>
          <p className="subheading text-lg md:text-xl max-w-2xl mx-auto text-white bg-black/30 backdrop-blur-sm p-4 rounded-lg">
            Learn step-by-step with personalized AI instruction, detailed explanations, and curated YouTube videos - all powered by free AI tools from AiWebTools.AI
          </p>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-in-up" delay={0.2} className="mt-8 space-x-4">
          <Button 
            size="lg" 
            className="rounded-full px-8 py-6 text-base font-semibold bg-white text-slate-900 hover:bg-white/90"
            asChild
          >
            <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer" aria-label="Start learning with Learn Any Skill GPT - Free AI Tool">
              Start Learning Now
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full px-8 py-6 text-base border-white text-white hover:bg-white/20 font-semibold"
            onClick={() => window.open('https://aiwebtools.lovable.app/?via=aiwebtools', '_blank')}
            aria-label="Explore more free AI tools at AiWebTools.AI"
          >
            Explore More Free AI Tools
          </Button>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-in-up" delay={0.4} className="mt-16 w-full max-w-5xl">
          <GlassMorphism className="p-2 md:p-4 overflow-hidden rounded-2xl bg-black/50 border-white/20">
            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video w-full">
              {/* Embed YouTube with autoplay, unmuted, 1080p quality, and preload for faster loading */}
              <iframe 
                src="https://www.youtube.com/embed/0_oIzDL2BB4?autoplay=1&mute=0&vq=hd1080&rel=0&modestbranding=1" 
                className="w-full h-full aspect-video"
                title="Learn Any Skill GPT Tutorial - Free AI Tools Demo"
                frameBorder="0"
                loading="eager"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                aria-label="Video demonstration of Learn Any Skill GPT free AI tool"
              ></iframe>
            </div>
          </GlassMorphism>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Hero;
