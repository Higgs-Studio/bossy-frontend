'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EditGoalForm } from './edit-goal-form';
import { TaskList } from './task-list';
import { GoalCalendar } from './goal-calendar';
import { getGoalWithTasks } from './actions';
import { useTranslation } from '@/contexts/translation-context';
import type { Goal, DailyTask } from '@/lib/supabase/queries';

export default function EditGoalPage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [goal, setGoal] = useState<Goal | null>(null);
    const [tasks, setTasks] = useState<DailyTask[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const id = params.id as string;
                const data = await getGoalWithTasks(id);
                
                if (!data.goal) {
                    router.push('/app/goals');
                    return;
                }

                setGoal(data.goal);
                setTasks(data.tasks);
            } catch (error) {
                router.push('/app/goals');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
                <div className="max-w-4xl mx-auto">
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-muted-foreground">{t.nav?.loading || 'Loading...'}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!goal) {
        return null;
    }

    // Calculate time horizon from dates
    const start = new Date(goal.start_date);
    const end = new Date(goal.end_date);
    const timeHorizon = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {t.editGoal?.title || 'Edit Goal'}
                </h1>
                
                <EditGoalForm goal={goal} timeHorizon={timeHorizon} />

                <GoalCalendar 
                    tasks={tasks}
                    startDate={goal.start_date}
                    endDate={goal.end_date}
                />
                
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
