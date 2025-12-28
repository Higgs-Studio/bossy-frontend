'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  actions?: React.ReactNode;
}

export function MobileMenu({ links, actions }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors min-h-[44px] min-w-[44px]"
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="fixed top-[64px] right-0 left-0 bg-white border-b border-slate-200 shadow-xl z-50 md:hidden animate-slide-in">
            <nav className="max-w-7xl mx-auto px-4 py-6 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
              {actions && (
                <div className="pt-4 space-y-2 border-t border-slate-200 mt-4">
                  {actions}
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

