'use client';

import Link from 'next/link';
import { MobileMenu } from '@/components/mobile-menu';

interface AppHeaderProps {
  userMenu: React.ReactNode;
}

export function AppHeader({ userMenu }: AppHeaderProps) {
  const navLinks = [
    { href: '/app/dashboard', label: 'Dashboard' },
    { href: '/app/goals', label: 'Goals' },
    { href: '/app/goal', label: 'Create Goal' },
    { href: '/app/boss', label: 'Boss' },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/app/dashboard" className="flex items-center group">
            <span className="text-xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
              Bossy
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/app/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/app/goals"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors relative group"
            >
              Goals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/app/boss"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors relative group"
            >
              Boss
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </nav>
          <div className="hidden md:flex items-center">
            {userMenu}
          </div>
          <div className="md:hidden flex items-center gap-2">
            {userMenu}
            <MobileMenu links={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}

