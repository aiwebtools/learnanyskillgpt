
import React, { useCallback, useEffect, useState } from 'react';
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => {
      document.body.style.overflow = prev ? 'auto' : 'hidden';
      return !prev;
    });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        closeMobileMenu();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen, closeMobileMenu]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen, closeMobileMenu]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const navLinks = [
    { label: 'Learn Any Skill GPT', href: 'https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt' },
    { label: 'Learn Any Course GPT', href: 'https://learnanycourse.lovable.app/' },
    { label: 'College Degree GPT', href: 'https://college-degree-gpt.lovable.app/' },
    { label: 'Talk to History GPT', href: 'https://talk-to-history-gpt.lovable.app/' },
    { label: 'More AI Tools', href: 'https://aiwebtools.lovable.app/?via=aiwebtools' },
  ];

  return (
    <div className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'py-1' : 'py-2')}>
      <GlassMorphism intensity={isScrolled ? 'high' : 'low'} className={cn('mx-2 sm:mx-4 lg:mx-6 transition-all duration-300', isScrolled && 'shadow-lg')}>
        <div className="flex items-center justify-between px-3 sm:px-4 py-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary shrink-0">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm sm:text-base lg:text-lg tracking-tight text-foreground truncate">Learn Any Skill GPT</span>
              <a href="https://aiwebtools.lovable.app/?via=aiwebtools" target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs text-muted-foreground hover:underline truncate">Presented by AiWebTools.AI</a>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 ml-4">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="link-underline text-xs lg:text-sm font-medium text-foreground whitespace-nowrap">
                {link.label}
              </a>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-4 shrink-0">
            <div className="hidden md:block">
              <Button size="sm" className="rounded-full px-4 lg:px-5 py-1 h-8 text-xs lg:text-sm" asChild>
                <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer">
                  Get Started
                </a>
              </Button>
            </div>
            <button 
              className="md:hidden p-2 rounded-md mobile-menu-button touch-manipulation"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - CSS transition for instant feel */}
        <div 
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200 ease-out mobile-menu-container',
            mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 border-t border-border">
            {navLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block py-2.5 text-sm font-medium text-foreground active:bg-accent/50 rounded-md px-2 -mx-2 touch-manipulation"
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" className="w-full rounded-full mt-3 py-2 h-10 text-sm" asChild>
              <a href="https://chatgpt.com/g/g-677690e9535c81919b3acbd5ec088644-learn-any-skill-gpt" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}>
                Get Started
              </a>
            </Button>
          </div>
        </div>
      </GlassMorphism>
    </div>
  );
};
export default Navbar;
