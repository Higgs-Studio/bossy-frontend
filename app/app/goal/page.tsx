import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getActiveGoal } from '@/lib/supabase/queries';
import { GoalForm } from './goal-form';

export default async function GoalPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Allow creating goals even if user has active goals

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
          Create Your Goal
        </h1>
        <GoalForm />
      </div>
    </div>
  );
}

