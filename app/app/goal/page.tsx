import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getActiveGoal } from '@/lib/supabase/queries';
import { GoalForm } from './goal-form';

export default async function GoalPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Check if user already has an active goal
  const activeGoal = await getActiveGoal(user.id);
  if (activeGoal) {
    redirect('/app/dashboard');
  }

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">
          Create Your Goal
        </h1>
        <GoalForm />
      </div>
    </div>
  );
}

