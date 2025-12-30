'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/supabase/get-session';
import { setUserBossType } from '@/lib/supabase/queries';
import type { BossType } from '@/lib/boss/reactions';
import { logError } from '@/lib/utils/logger';

export async function changeBossAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const bossType = formData.get('bossType') as BossType;

  if (!bossType) {
    return { error: 'Please select a boss type' };
  }

  const validBossTypes: BossType[] = ['execution', 'supportive', 'mentor', 'drill-sergeant'];
  if (!validBossTypes.includes(bossType)) {
    return { error: 'Invalid boss type selected' };
  }

  try {
    await setUserBossType(user.id, bossType);
    revalidatePath('/app/boss');
    return { success: true };
  } catch (error) {
    logError('Error changing boss', error, { userId: user.id, bossType });
    return { error: 'Failed to change boss. Please try again.' };
  }
}

