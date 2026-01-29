'use client';

import { BossSelector } from './boss-selector';
import { useTranslation } from '@/contexts/translation-context';
import { useEffect, useState } from 'react';
import { getBossTypeAndLanguage, checkSubscription } from './actions';
import { WhatsAppContactWrapper } from '@/components/whatsapp-contact-wrapper';

export default function BossPage() {
  const { t } = useTranslation();
  const [bossData, setBossData] = useState<{ bossType: 'execution' | 'supportive' | 'mentor' | 'drill-sergeant', bossLanguage: 'en' | 'zh-CN' | 'zh-TW' | 'zh-HK', hasActiveSubscription: boolean } | null>(null);

  useEffect(() => {
    Promise.all([getBossTypeAndLanguage(), checkSubscription()]).then(([typeAndLang, hasSub]) => {
      setBossData({ ...typeAndLang, hasActiveSubscription: hasSub });
    });
  }, []);

  if (!bossData) {
    return (
      <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">{t.nav?.loading || 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto space-y-6">
        <WhatsAppContactWrapper closable={false} />
        
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {t.boss?.title || 'Your AI Boss'}
          </h1>
          <p className="text-muted-foreground text-lg">{t.boss?.subtitle || 'Choose your accountability partner'}</p>
        </div>

        <BossSelector currentBossType={bossData.bossType} currentBossLanguage={bossData.bossLanguage} hasActiveSubscription={bossData.hasActiveSubscription} />
      </div>
    </div>
  );
}
