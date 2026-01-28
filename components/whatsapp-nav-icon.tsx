'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserPhoneAction } from '@/app/app/profile/actions';

const WHATSAPP_NUMBER_CLEAN = '85295427840';

export function WhatsAppNavIcon() {
  const router = useRouter();
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    getUserPhoneAction().then((phone) => {
      setUserPhone(phone);
      setLoading(false);
    });
  }, []);

  const handleClick = () => {
    if (userPhone) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER_CLEAN}`, '_blank');
    } else {
      router.push('/app/profile');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
          userPhone
            ? 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/30'
            : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-950/30'
        }`}
        aria-label="WhatsApp Contact"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">text boss</span>
      </button>

      {/* Hover Tooltip */}
      {isHovered && (
        <div className="absolute right-0 top-full mt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {userPhone ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/90 dark:to-emerald-950/90 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-green-900 dark:text-green-100 mb-1">
                    💬 Message your boss!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mb-3">
                    Your accountability partner is just a click away
                  </p>
                  <button
                    onClick={handleClick}
                    className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Chat Now
                  </button>
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
                  <p className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-1">
                    🔒 Unlock boss access
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mb-3">
                    Add your phone to enable WhatsApp support
                  </p>
                  <button
                    onClick={handleClick}
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
