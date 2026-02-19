'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/translation-context';

interface WhatsAppContactProps {
  userPhone?: string | null;
  closable?: boolean;
}

const WHATSAPP_NUMBER = '+852 9542 7840';
const WHATSAPP_NUMBER_CLEAN = '85295427840';
const WHATSAPP_NUMBER_DISPLAY = '+852 9542 7840';
const STORAGE_KEY = 'whatsapp-banner-collapsed';

export function WhatsAppContact({ userPhone, closable = false }: WhatsAppContactProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(STORAGE_KEY, String(newState));
  };

  return (
    <>
      {userPhone ? (
        <Card className="border border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 transition-all duration-200">
          <CardContent className="pt-4 pb-4">
            {/* Collapsed Header - Always Visible */}
            <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-between gap-4 text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-900 dark:text-green-100">
                    💬 {t.whatsapp.banner.headline}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {isCollapsed ? (
                  <ChevronDown className="h-5 w-5 text-green-700 dark:text-green-300" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-green-700 dark:text-green-300" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {!isCollapsed && (
              <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                      {t.whatsapp.banner.hasPhoneDescription}
                    </p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {WHATSAPP_NUMBER_DISPLAY}
                    </p>
                  </div>
                  <Button
                    asChild
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER_CLEAN}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t.whatsapp.banner.chatNow}
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 transition-all duration-200">
          <CardContent className="pt-4 pb-4">
            {/* Collapsed Header - Always Visible */}
            <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-between gap-4 text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-900 dark:text-orange-100">
                    💬 {t.whatsapp.banner.headline}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {isCollapsed ? (
                  <ChevronDown className="h-5 w-5 text-orange-700 dark:text-orange-300" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-orange-700 dark:text-orange-300" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {!isCollapsed && (
              <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-700">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    🔒 {t.whatsapp.banner.noPhoneDescription}
                  </p>
                  <Button
                    onClick={() => router.push('/app/profile')}
                    variant="outline"
                    size="sm"
                    className="border-orange-500 text-orange-700 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-950/50"
                  >
                    {t.whatsapp.banner.unlockAccess}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
