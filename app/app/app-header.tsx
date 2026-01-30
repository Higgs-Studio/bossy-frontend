'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MobileMenu } from '@/components/mobile-menu';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';
import { WhatsAppNavIcon } from '@/components/whatsapp-nav-icon';
import { useTranslation } from '@/contexts/translation-context';

interface AppHeaderProps {
  userMenu: React.ReactNode;
}

export function AppHeader({ userMenu }: AppHeaderProps) {
  const { t } = useTranslation();

  const navLinks = [
    { href: '/app/dashboard', label: t.nav?.dashboard || 'Dashboard' },
    { href: '/app/goals', label: t.nav?.goals || 'Goals' },
    { href: '/app/boss', label: t.nav?.boss || 'Boss' },
  ];

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Logo - Left */}
          <Link href="/app/dashboard" className="flex items-center group">
            <Image 
              src="/logo.svg" 
              alt="Bossy" 
              width={375} 
              height={140}
              className="h-[90px] w-auto transition-all duration-300 group-hover:brightness-0 group-hover:saturate-100 group-hover:[filter:brightness(0)_saturate(100%)_invert(34%)_sepia(85%)_saturate(3038%)_hue-rotate(250deg)_brightness(93%)_contrast(94%)]"
              priority
            />
          </Link>
          
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/app/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.nav?.dashboard || 'Dashboard'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/app/goals"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.nav?.goals || 'Goals'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/app/boss"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t.nav?.boss || 'Boss'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          
          {/* Actions - Right */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <WhatsAppNavIcon />
            <ThemeSwitcher />
            <LanguageSwitcher />
            {userMenu}
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <WhatsAppNavIcon />
            <ThemeSwitcher />
            <LanguageSwitcher />
            {userMenu}
            <MobileMenu links={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}

