'use client';

import { useActionState, useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BOSS_PERSONALITIES, getBossPersonality, type BossType, type BossLanguage } from '@/lib/boss/reactions';
import { changeBossAction } from './actions';
import { Loader2, CheckCircle2, Globe, Crown } from 'lucide-react';
import { useTranslation } from '@/contexts/translation-context';
import { useRouter } from 'next/navigation';

type BossSelectorProps = {
  currentBossType: BossType;
  currentBossLanguage: BossLanguage;
  hasActiveSubscription: boolean;
};

const LANGUAGE_OPTIONS = [
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
  { code: 'zh-CN' as const, label: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW' as const, label: '繁體中文', flag: '🇹🇼' },
  { code: 'zh-HK' as const, label: '粵語', flag: '🇭🇰' },
];

export function BossSelector({ currentBossType, currentBossLanguage, hasActiveSubscription }: BossSelectorProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(changeBossAction, null);
  const [selectedBoss, setSelectedBoss] = useState<BossType>(currentBossType);
  const [selectedLanguage, setSelectedLanguage] = useState<BossLanguage>(currentBossLanguage);
  const bossBase = getBossPersonality(selectedBoss);
  
  // Get translated boss personality
  const boss = {
    ...bossBase,
    nickname: t.boss?.personalities?.[selectedBoss]?.nickname || bossBase.nickname,
    description: t.boss?.personalities?.[selectedBoss]?.description || bossBase.description,
    rules: t.boss?.personalities?.[selectedBoss]?.rules || bossBase.rules,
  };

  // Update selected boss when currentBossType changes (after server revalidation)
  useEffect(() => {
    setSelectedBoss(currentBossType);
    setSelectedLanguage(currentBossLanguage);
  }, [currentBossType, currentBossLanguage]);

  const hasChanges = selectedBoss !== currentBossType || selectedLanguage !== currentBossLanguage;
  
  // Check if user selected a paid boss without subscription
  const isFreeBoss = (bossType: BossType) => bossType === 'supportive'; // Only Pip is free
  const selectedPaidBossWithoutSubscription = !hasActiveSubscription && !isFreeBoss(selectedBoss) && selectedBoss !== currentBossType;
  
  const handleUpgradeClick = () => {
    router.push('/app/profile#subscription');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Boss Display */}
      <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={boss.avatar}
                alt={boss.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{boss.name}</CardTitle>
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">"{boss.nickname}"</p>
              <p className="text-sm text-muted-foreground mt-1">{t.boss?.aiPartner || 'Your AI Accountability Partner'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="p-5 bg-muted/50 rounded-lg border border-border">
            <p className="text-foreground leading-relaxed text-base">{boss.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-4 text-lg">
              {t.boss?.rules || 'Rules'}
            </h3>
            <ul className="space-y-3">
              {boss.rules.map((rule: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:border-border/80 transition-colors">
                  <span className="text-muted-foreground font-medium mt-0.5">•</span>
                  <span className="text-foreground leading-relaxed flex-1">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 p-5 bg-muted/50 border border-border rounded-lg">
            <p className="text-foreground font-semibold text-base mb-2">
              {t.boss?.noNegotiations || 'No Negotiations'}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.boss?.noNegotiationsDesc || 'This boss does not negotiate. Commitments are final. Accountability is non-negotiable.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Boss Selection Form */}
      <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle>{t.boss?.changeBoss || 'Change Your Boss'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="bossType" value={selectedBoss} />
            <input type="hidden" name="bossLanguage" value={selectedLanguage} />
            
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-base">{t.boss?.bossPersonality || 'Boss Personality'}</h3>
              <RadioGroup
                value={selectedBoss}
                onValueChange={(value) => setSelectedBoss(value as BossType)}
                className="space-y-3"
              >
                {Object.values(BOSS_PERSONALITIES).map((bossOption) => {
                  const translatedNickname = t.boss?.personalities?.[bossOption.id]?.nickname || bossOption.nickname;
                  const translatedDescription = t.boss?.personalities?.[bossOption.id]?.description || bossOption.description;
                  const isFree = isFreeBoss(bossOption.id);
                  const isPaid = !isFree;
                  return (
                    <label
                      key={bossOption.id}
                      htmlFor={`boss-${bossOption.id}`}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedBoss === bossOption.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-sm'
                        : 'border-border hover:border-border/80 hover:bg-muted/50'
                    }`}
                    >
                      <RadioGroupItem value={bossOption.id} id={`boss-${bossOption.id}`} className="mt-1" />
                      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={bossOption.avatar}
                          alt={bossOption.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="cursor-pointer flex-1">
                          <span className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-base">{bossOption.name}</span>
                          {currentBossType === bossOption.id && (
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                              {t.boss?.current || 'Current'}
                            </span>
                          )}
                          {isFree && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                              Free
                            </span>
                          )}
                          {isPaid && (
                            <span className="text-xs bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                              <Crown className="h-3 w-3" />
                              Plus
                            </span>
                          )}
                        </span>
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 block mb-1">"{translatedNickname}"</span>
                        <span className="text-sm text-muted-foreground block">{translatedDescription}</span>
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-base">{t.boss?.bossLanguage || 'Boss Language'}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {t.boss?.bossLanguageDesc || 'Choose the language your AI boss uses for feedback (independent from app language)'}
              </p>
              <RadioGroup
                value={selectedLanguage}
                onValueChange={(value) => setSelectedLanguage(value as BossLanguage)}
                className="grid grid-cols-2 gap-3"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <label
                    key={lang.code}
                    htmlFor={`lang-${lang.code}`}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedLanguage === lang.code
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-sm'
                        : 'border-border hover:border-border/80 hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} />
                    <span className="cursor-pointer flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium text-sm">{lang.label}</span>
                      </span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {state?.error && (
              <div className="text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/50 p-4 rounded-lg border-2 border-red-200 dark:border-red-900 font-medium">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="text-emerald-700 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-lg border-2 border-emerald-200 dark:border-emerald-900 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {t.boss?.bossChanged || 'Boss changed successfully!'}
              </div>
            )}

            {selectedPaidBossWithoutSubscription ? (
              <Button 
                type="button"
                onClick={handleUpgradeClick}
                className="w-full" 
                size="lg"
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Plus to Unlock
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isPending || !hasChanges} 
                className="w-full" 
                size="lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.boss?.changingBoss || 'Changing Boss...'}
                  </>
                ) : (
                  t.boss?.saveChanges || 'Save Changes'
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
