'use client';

import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useWhatsAppContact } from '@/lib/hooks/use-whatsapp-contact';

export function WhatsAppNavIcon() {
  const { hasPhone, loading, openWhatsApp } = useWhatsAppContact();
  const [isHovered, setIsHovered] = useState(false);

  if (loading) return null;

  return (
    <div className="relative">
      <button
        onClick={openWhatsApp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
          hasPhone
            ? 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/30'
            : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-950/30'
        }`}
        aria-label="WhatsApp Contact"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Text Boss</span>
      </button>

      {isHovered && (
        <div className="absolute right-0 top-full mt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {hasPhone ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/90 dark:to-emerald-950/90 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-green-900 dark:text-green-100 mb-1">Message your boss!</p>
                  <p className="text-xs text-green-700 dark:text-green-300">Your boss is just a click away</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/90 dark:to-yellow-950/90 border border-orange-200 dark:border-orange-800 rounded-lg shadow-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-1">Unlock boss access</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mb-3">Add your phone to enable WhatsApp support</p>
                  <button
                    onClick={openWhatsApp}
                    className="w-full px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Add Phone
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
