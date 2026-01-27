'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/mobile-menu';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function PublicHeader() {
  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const mobileActions = (
    <>
      <Button variant="ghost" asChild className="w-full justify-start min-h-[44px]">
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button asChild className="w-full min-h-[44px]">
        <Link href="/sign-up">Get Started</Link>
      </Button>
    </>
  );

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
              Bossy
            </span>
          </Link>
          
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          
          {/* Actions - Right */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <ThemeSwitcher />
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <ThemeSwitcher />
            <MobileMenu links={navLinks} actions={mobileActions} />
          </div>
        </div>
      </div>
    </header>
  );
}

