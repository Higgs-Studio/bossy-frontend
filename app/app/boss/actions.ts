'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/supabase/get-session';
import { setUserBossType, setUserBossLanguage, getUserPreferences, getUserBossType, getUserBossLanguage } from '@/lib/supabase/queries';
import { canChangeBossType, getUserPlan } from '@/lib/subscriptions/service';
import type { BossType, BossLanguage } from '@/lib/boss/reactions';
import { logError } from '@/lib/utils/logger';
import { createClient } from '@/lib/supabase/server';

export async function getBossTypeAndLanguage(): Promise<{ bossType: BossType; bossLanguage: BossLanguage }> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const [bossType, bossLanguage] = await Promise.all([
    getUserBossType(user.id),
    getUserBossLanguage(user.id),
  ]);

  return { bossType, bossLanguage };
}

export async function changeBossAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const bossType = formData.get('bossType') as BossType;
  const bossLanguage = formData.get('bossLanguage') as BossLanguage;

  if (!bossType) {
    return { error: 'Please select a boss type' };
  }

  if (!bossLanguage) {
    return { error: 'Please select a boss language' };
  }

  const validBossTypes: BossType[] = ['execution', 'supportive', 'mentor', 'drill-sergeant'];
  if (!validBossTypes.includes(bossType)) {
    return { error: 'Invalid boss type selected' };
  }

  const validLanguages: BossLanguage[] = ['en', 'zh-CN', 'zh-TW', 'zh-HK'];
  if (!validLanguages.includes(bossLanguage)) {
    return { error: 'Invalid boss language selected' };
  }

  try {
    // Check if user can change boss type (based on subscription)
    const currentBossType = await getUserBossType(user.id);
    if (bossType !== currentBossType) {
      const canChange = await canChangeBossType(user.id);
      if (!canChange) {
        const plan = await getUserPlan(user.id);
        return { 
          error: `Upgrade to Plus to unlock all boss personalities. You're currently on the ${plan.planName} plan.`
        };
      }
    }
    // Use upsert to update both boss_type and boss_language at once
    const supabase = await createClient();
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        boss_type: bossType,
        boss_language: bossLanguage,
      }, {
        onConflict: 'user_id',
      });

    if (error) throw error;

    revalidatePath('/app/boss');
    return { success: true };
  } catch (error) {
    logError('Error changing boss', error, { userId: user.id, bossType, bossLanguage });
    return { error: 'Failed to change boss. Please try again.' };
  }
}

