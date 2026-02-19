import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getGoalById, getTasksForGoal } from '@/lib/supabase/queries';
import { GoalDetailContent } from './goal-detail-content';

export default async function EditGoalPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getUser();
    if (!user) redirect('/sign-in');

    const { id } = await params;
    const goal = await getGoalById(id, user.id);
    if (!goal) redirect('/app/goals');

    const tasks = await getTasksForGoal(goal.id, user.id);

    return <GoalDetailContent goal={goal} tasks={tasks} />;
}
