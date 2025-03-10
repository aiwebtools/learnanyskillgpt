
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import CourseExample from '@/components/CourseExample';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import DisclaimerPopup from '@/components/DisclaimerPopup';

const Index = () => {
  // Ensure smooth scrolling for anchor links
  useEffect(() => {
    // Preload the video content
    const preloadVideo = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = 'https://www.youtube.com/embed/q1AY2LukHrk?autoplay=1&mute=0&vq=hd1080';
      link.as = 'iframe';
      document.head.appendChild(link);
    };
    
    preloadVideo();
    
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.href.includes(window.location.pathname)) {
        e.preventDefault();
        
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
          
          // Update URL but don't scroll (we already did that)
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DisclaimerPopup />
      <main>
        <Hero />
        <HowItWorks />
        <CTA />
        <Features />
        <CourseExample />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
