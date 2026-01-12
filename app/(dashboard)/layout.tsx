'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { PublicUserMenu } from './public-user-menu';
import { MobileMenu } from '@/components/mobile-menu';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTranslation } from '@/contexts/translation-context';

function Header() {
  const { t } = useTranslation();

  const navLinks = [
    { href: '/#features', label: t.common?.features || 'Features' },
    { href: '/#how-it-works', label: t.common?.howItWorks || 'How It Works' },
    { href: '/pricing', label: t.common?.pricing || 'Pricing' },
  ];

  const mobileActions = (
    <>
      <Button variant="ghost" asChild className="w-full justify-start min-h-[44px]">
        <Link href="/sign-in">{t.common?.signIn || 'Sign In'}</Link>
      </Button>
      <Button asChild className="w-full min-h-[44px]">
        <Link href="/sign-up">{t.common?.getStarted || 'Get Started'}</Link>
      </Button>
    </>
  );

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
              Bossy
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.common?.features || 'Features'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.common?.howItWorks || 'How It Works'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.common?.pricing || 'Pricing'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">{t.common?.signIn || 'Sign In'}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">{t.common?.getStarted || 'Get Started'}</Link>
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <MobileMenu links={navLinks} actions={mobileActions} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
