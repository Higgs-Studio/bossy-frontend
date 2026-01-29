import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getUserGoals } from '@/lib/supabase/queries';
import { GoalsListContent } from './goals-list-content';
import { getUserPlan, hasActiveSubscription } from '@/lib/subscriptions/service';

export default async function GoalsPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const [goals, userPlan, hasActiveSub] = await Promise.all([
    getUserGoals(user.id),
    getUserPlan(user.id),
    hasActiveSubscription(user.id),
  ]);

  return (
    <GoalsListContent 
      goals={goals} 
      hasActiveSubscription={hasActiveSub}
      maxActiveGoals={userPlan.limits.maxActiveGoals}
    />
  );
}


