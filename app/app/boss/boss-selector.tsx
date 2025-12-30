'use client';

import { useActionState, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BOSS_PERSONALITIES, getBossPersonality, type BossType } from '@/lib/boss/reactions';
import { changeBossAction } from './actions';
import { Loader2, CheckCircle2 } from 'lucide-react';

type BossSelectorProps = {
  currentBossType: BossType;
};

export function BossSelector({ currentBossType }: BossSelectorProps) {
  const [state, formAction, isPending] = useActionState(changeBossAction, null);
  const [selectedBoss, setSelectedBoss] = useState<BossType>(currentBossType);
  const boss = getBossPersonality(selectedBoss);

  // Update selected boss when currentBossType changes (after server revalidation)
  useEffect(() => {
    setSelectedBoss(currentBossType);
  }, [currentBossType]);

  const hasChanges = selectedBoss !== currentBossType;

  return (
    <div className="space-y-6">
      {/* Current Boss Display */}
      <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
        <CardHeader className="border-b border-slate-200">
          <div>
            <CardTitle className="text-2xl">{boss.name}</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Your AI Accountability Partner</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-800 leading-relaxed text-base">{boss.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-slate-900 mb-4 text-lg">
              Rules
            </h3>
            <ul className="space-y-3">
              {boss.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                  <span className="text-slate-400 font-medium mt-0.5">•</span>
                  <span className="text-slate-800 leading-relaxed flex-1">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-slate-900 font-semibold text-base mb-2">
              No Negotiations
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">
              This boss does not negotiate. Commitments are final. Accountability is non-negotiable.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Boss Selection Form */}
      <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle>Change Your Boss</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="bossType" value={selectedBoss} />
            
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
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                    <span className="text-sm text-gray-600 block">{bossOption.description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>

            {state?.error && (
              <div className="text-red-700 text-sm bg-red-50 p-4 rounded-lg border-2 border-red-200 font-medium">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="text-emerald-700 text-sm bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200 font-medium flex items-center gap-2">
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
