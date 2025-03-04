
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import GlassMorphism from './ui/GlassMorphism';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scrolling when mobile menu is open
    document.body.style.overflow = mobileMenuOpen ? 'auto' : 'hidden';
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      // Reset overflow when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  // Apply body overflow style based on mobile menu state
  useEffect(() => {
    return () => {
      // Clean up overflow style on unmount
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'py-1' : 'py-2')}>
      <GlassMorphism intensity={isScrolled ? 'high' : 'low'} className={cn('mx-2 sm:mx-4 lg:mx-6 transition-all duration-300', isScrolled && 'shadow-lg')}>
        <div className="flex items-center justify-between px-3 sm:px-4 py-2">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-gray-900 dark:text-white">Learn Any Skill GPT</span>
              <a href="https://www.AiWebTools.Ai" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-700 dark:text-gray-300 hover:underline">Presented by Ai Web Tools LLC</a>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 ml-4">
            <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer" className="link-underline text-sm font-medium text-gray-900 dark:text-white">Learn Any Skill GPT</a>
            <a href="https://learnanycourse.lovable.app/" target="_blank" rel="noopener noreferrer" className="link-underline text-sm font-medium text-gray-900 dark:text-white">Learn Any Course GPT</a>
            <a href="https://college-degree-gpt.lovable.app/" target="_blank" rel="noopener noreferrer" className="link-underline text-sm font-medium text-gray-900 dark:text-white">College Degree GPT</a>
            <a href="https://talk-to-history-gpt.lovable.app/" target="_blank" rel="noopener noreferrer" className="link-underline text-sm font-medium text-gray-900 dark:text-white">Talk to History GPT</a>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex items-center ml-auto md:ml-0">
            <div className="hidden md:block">
              <Button size="sm" className="rounded-full px-5 py-1 h-8" asChild>
                <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer">
                  Get Started
                </a>
              </Button>
            </div>
            <button 
              className="md:hidden p-2 rounded-md ml-2 mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-gray-900 dark:text-white" /> : <Menu className="h-5 w-5 text-gray-900 dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-gray-300 dark:border-gray-700 mobile-menu-container nav-menu-mobile">
            <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer" 
              className="block py-2 text-sm font-medium text-gray-900 dark:text-white">
              Learn Any Skill GPT
            </a>
            <a href="https://learnanycourse.lovable.app/" target="_blank" rel="noopener noreferrer" 
              className="block py-2 text-sm font-medium text-gray-900 dark:text-white">
              Learn Any Course GPT
            </a>
            <a href="https://college-degree-gpt.lovable.app/" target="_blank" rel="noopener noreferrer" 
              className="block py-2 text-sm font-medium text-gray-900 dark:text-white">
              College Degree GPT
            </a>
            <a href="https://talk-to-history-gpt.lovable.app/" target="_blank" rel="noopener noreferrer" 
              className="block py-2 text-sm font-medium text-gray-900 dark:text-white">
              Talk to History GPT
            </a>
            <Button size="sm" className="w-full rounded-full mt-2 py-1 h-9" asChild>
              <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer">
                Get Started
              </a>
            </Button>
          </div>
        )}
      </GlassMorphism>
    </div>
  );
};
export default Navbar;
