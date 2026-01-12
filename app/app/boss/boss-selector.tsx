'use client';

import { useActionState, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BOSS_PERSONALITIES, getBossPersonality, type BossType, type BossLanguage } from '@/lib/boss/reactions';
import { changeBossAction } from './actions';
import { Loader2, CheckCircle2, Globe } from 'lucide-react';

type BossSelectorProps = {
  currentBossType: BossType;
  currentBossLanguage: BossLanguage;
};

const LANGUAGE_OPTIONS = [
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
  { code: 'zh-CN' as const, label: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW' as const, label: '繁體中文', flag: '🇹🇼' },
  { code: 'zh-HK' as const, label: '粵語', flag: '🇭🇰' },
];

export function BossSelector({ currentBossType, currentBossLanguage }: BossSelectorProps) {
  const [state, formAction, isPending] = useActionState(changeBossAction, null);
  const [selectedBoss, setSelectedBoss] = useState<BossType>(currentBossType);
  const [selectedLanguage, setSelectedLanguage] = useState<BossLanguage>(currentBossLanguage);
  const boss = getBossPersonality(selectedBoss);

  // Update selected boss when currentBossType changes (after server revalidation)
  useEffect(() => {
    setSelectedBoss(currentBossType);
    setSelectedLanguage(currentBossLanguage);
  }, [currentBossType, currentBossLanguage]);

  const hasChanges = selectedBoss !== currentBossType || selectedLanguage !== currentBossLanguage;

  return (
    <div className="space-y-6">
      {/* Current Boss Display */}
      <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
        <CardHeader className="border-b border-border">
          <div>
            <CardTitle className="text-2xl">{boss.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Your AI Accountability Partner</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="p-5 bg-muted/50 rounded-lg border border-border">
            <p className="text-foreground leading-relaxed text-base">{boss.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-4 text-lg">
              Rules
            </h3>
            <ul className="space-y-3">
              {boss.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:border-border/80 transition-colors">
                  <span className="text-muted-foreground font-medium mt-0.5">•</span>
                  <span className="text-foreground leading-relaxed flex-1">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 p-5 bg-muted/50 border border-border rounded-lg">
            <p className="text-foreground font-semibold text-base mb-2">
              No Negotiations
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This boss does not negotiate. Commitments are final. Accountability is non-negotiable.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Boss Selection Form */}
      <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle>Change Your Boss</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="bossType" value={selectedBoss} />
            <input type="hidden" name="bossLanguage" value={selectedLanguage} />
            
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-base">Boss Personality</h3>
              <RadioGroup
                value={selectedBoss}
                onValueChange={(value) => setSelectedBoss(value as BossType)}
                className="space-y-3"
              >
                {Object.values(BOSS_PERSONALITIES).map((bossOption) => (
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
                    <span className="cursor-pointer flex-1">
                      <span className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-base">{bossOption.name}</span>
                        {currentBossType === bossOption.id && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                            Current
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground block">{bossOption.description}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-base">Boss Language</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Choose the language your AI boss uses for feedback (independent from app language)
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
                Boss changed successfully!
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isPending || !hasChanges} 
              className="w-full" 
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Boss...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
