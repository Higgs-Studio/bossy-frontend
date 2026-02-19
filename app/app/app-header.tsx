'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MobileMenu } from '@/components/mobile-menu';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';
import { WhatsAppNavIcon } from '@/components/whatsapp-nav-icon';
import { useTranslation } from '@/contexts/translation-context';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  userMenu: React.ReactNode;
}

export function AppHeader({ userMenu }: AppHeaderProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navLinks = [
    { href: '/app/dashboard', label: t.nav?.dashboard || 'Dashboard' },
    { href: '/app/goals', label: t.nav?.goals || 'Goals' },
    { href: '/app/boss', label: t.nav?.boss || 'Boss' },
  ];

  const isActive = (href: string) => {
    if (href === '/app/goals') return pathname.startsWith('/app/goals') || pathname === '/app/goal';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          <Link href="/app/dashboard" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Bossy"
              width={160}
              height={60}
              className="h-12 w-auto transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative group',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-200',
                      active ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <WhatsAppNavIcon />
            <ThemeSwitcher />
            <LanguageSwitcher />
            {userMenu}
          </div>

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
