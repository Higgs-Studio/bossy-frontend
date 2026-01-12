import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getUserGoals } from '@/lib/supabase/queries';
import { GoalsListContent } from './goals-list-content';

export default async function GoalsPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const goals = await getUserGoals(user.id);

  return <GoalsListContent goals={goals} />;
}


