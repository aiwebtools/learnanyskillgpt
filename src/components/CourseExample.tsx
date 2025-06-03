
import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedSection from './AnimatedSection';
import GlassMorphism from './ui/GlassMorphism';
import { ArrowRight } from 'lucide-react';

const CourseExample: React.FC = () => {
  return <section id="example" className="py-24 relative overflow-hidden" role="region" aria-labelledby="example-heading">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true"></div>
      <div className="section-container relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" className="inline-block" aria-label="Try Learn Any Skill GPT free AI tool now">
            <span className="chip mb-6 cursor-pointer hover:bg-primary/90 transition-colors">See Our Free AI Tool In Action</span>
          </a>
          <h2 id="example-heading" className="heading mb-6">Master Any Skill with AI-Guided Learning - Free AI Tools</h2>
          <p className="subheading max-w-2xl mx-auto">Learn Any Skill GPT takes you from beginner to expert with personalized instruction, curated YouTube videos, and visual learning aids. No matter what you want to learn, our free AI teacher is ready to guide you every step of the way.</p>
        </AnimatedSection>
        
        <AnimatedSection>
          <div className="max-w-4xl mx-auto">
            <GlassMorphism 
              variant="dark" 
              intensity="high" 
              className="p-8 text-center text-white"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to master a new skill with free AI tools?</h3>
              <p className="mb-6 text-gray-300">Our AI teacher powered by advanced free AI tools is available 24/7 to guide you through any learning journey.</p>
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-base font-semibold bg-primary text-white hover:bg-primary/90"
                asChild
              >
                <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer" aria-label="Start learning now with our free AI tool">
                  Start Learning Now - Free AI Tool <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </Button>
            </GlassMorphism>
          </div>
        </AnimatedSection>
      </div>
    </section>;
};

export default CourseExample;
