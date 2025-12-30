import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getGoalById, getTasksForGoal } from '@/lib/supabase/queries';
import { EditGoalForm } from './edit-goal-form';
import { TaskList } from './task-list';

export default async function EditGoalPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    // In Next.js 15, params is a Promise
    const { id } = await params;

    const goal = await getGoalById(id, user.id);
    if (!goal) {
        redirect('/app/goals');
    }

    // Get tasks for this goal
    const tasks = await getTasksForGoal(goal.id, user.id);

    // Calculate time horizon from dates
    const start = new Date(goal.start_date);
    const end = new Date(goal.end_date);
    const timeHorizon = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                    Edit Goal
                </h1>
                
                <EditGoalForm goal={goal} timeHorizon={timeHorizon} />
                
                <TaskList 
                    goalId={goal.id} 
                    tasks={tasks}
                    startDate={goal.start_date}
                    endDate={goal.end_date}
                />
            </div>
        </div>
    );
}
