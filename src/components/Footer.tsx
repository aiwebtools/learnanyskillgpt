
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const Footer: React.FC = () => {
  return <footer className="bg-secondary/30 py-12 border-t border-border">
      <div className="section-container py-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-bold tracking-tight">Learn Any Skill GPT</span>
            </div>
            <a 
              href="https://www.aiwebtools.ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block mb-4 text-sm text-primary hover:text-primary/90 transition-colors font-medium"
            >
              Presented By AiWebTools.Ai
            </a>
            <p className="text-sm text-muted-foreground">
              Your personal AI tutor, offering comprehensive step-by-step guidance to master any skill from beginner to expert.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-sm">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://docs.google.com/document/d/1TpVG9pncULpkHy9IhAjyXIgScyTW703Lf-IQKkXeJs4/edit?tab=t.0" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Open Source College Degree GPT Prompt</a>
              </li>
              <li>
                <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Learn Any Skill GPT</a>
              </li>
              <li>
                <a href="https://learnanycourse.lovable.app/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Learn Any Course GPT</a>
              </li>
              <li>
                <a href="https://docs.google.com/document/d/1qtDKo3XN_EsspgrQD72Cpq2qh83H5xSd/edit?usp=sharing&ouid=116187507271950139405&rtpof=true&sd=true" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Ai Tools Free Downloadable List</a>
              </li>
              <li>
                <a href="https://college-degree-gpt.lovable.app/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">College Degree GPT</a>
              </li>
              <li>
                <a href="https://chatgpt.com/g/g-cUahkn19i-quiz-maker-ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Quiz Maker GPT</a>
              </li>
              <li className="pt-2">
                <a href="https://www.aiwebtools.ai" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    MORE AI TOOLS
                  </Button>
                </a>
              </li>
              <li className="pt-1">
                <a href="https://chatgpt.com/g/g-cUahkn19i-quiz-maker-ai" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    QUIZ MAKER GPT
                  </Button>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 text-sm">Ai Web Tools LLC</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.aiwebtools.ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://aiwebtools.ai/terms-of-services" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="tel:+14758008096" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Our 24/7 Ai Agent
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 AI WEB TOOLS LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};

export default Footer;
