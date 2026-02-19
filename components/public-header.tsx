'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/mobile-menu';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/contexts/translation-context';
import { PublicUserMenu } from '@/app/(dashboard)/public-user-menu';

type PublicHeaderUser = {
  id: string;
  email?: string;
};

export function PublicHeader({ user }: { user?: PublicHeaderUser | null } = {}) {
  const { t } = useTranslation();

  const navLinks = [
    { href: '/#features', label: t.common.features },
    { href: '/#how-it-works', label: t.common.howItWorks },
    { href: '/pricing', label: t.common.pricing },
  ];

  const mobileActions = (
    <>
      <Button variant="ghost" asChild className="w-full justify-start min-h-[44px]">
        <Link href="/sign-in">{t.common.signIn}</Link>
      </Button>
      <Button asChild className="w-full min-h-[44px]">
        <Link href="/sign-up">{t.common.getStarted}</Link>
      </Button>
    </>
  );

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Logo - Left */}
          <Link href={user ? '/app/dashboard' : '/'} className="flex items-center group">
            <Image 
              src="/logo.png" 
              alt={t.common.appName}
              width={160} 
              height={60}
              className="h-12 w-auto transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>
          
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.common.features}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.common.howItWorks}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.common.pricing}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          
          {/* Actions - Right */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <ThemeSwitcher />
            <LanguageSwitcher />
            {user ? (
              <PublicUserMenu user={user} />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">{t.common.signIn}</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">{t.common.getStarted}</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <ThemeSwitcher />
            <LanguageSwitcher />
            {user ? <PublicUserMenu user={user} /> : null}
            <MobileMenu links={navLinks} actions={user ? undefined : mobileActions} />
          </div>
        </div>
      </div>
    </header>
  );
}

