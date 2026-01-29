'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EditGoalForm } from './edit-goal-form';
import { TaskList } from './task-list';
import { GoalCalendar } from './goal-calendar';
import { getGoalWithTasks } from './actions';
import { useTranslation } from '@/contexts/translation-context';
import type { Goal, DailyTask } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditGoalPage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [goal, setGoal] = useState<Goal | null>(null);
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshData = async () => {
        try {
            const id = params.id as string;
            const data = await getGoalWithTasks(id);
            
            if (!data.goal) {
                return;
            }

            setGoal(data.goal);
            setTasks(data.tasks);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    };

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
            <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
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
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Link href="/app/goals">
                            <ArrowLeft className="h-4 w-4" />
                            {t.nav?.back || 'Back'}
                        </Link>
                    </Button>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        {t.editGoal?.title || 'Edit Goal'}: {goal.title}
                    </h1>
                </div>
                
                {/* 2-Column Layout: Left = Edit Goal + Calendar, Right = Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Edit Goal + Calendar */}
                    <div className="space-y-6">
                        <EditGoalForm goal={goal} timeHorizon={timeHorizon} />
                        
                        <GoalCalendar 
                            key={`calendar-${refreshKey}`}
                            tasks={tasks}
                            startDate={goal.start_date}
                            endDate={goal.end_date}
                        />
                    </div>
                    
                    {/* Right Column - Tasks Section */}
                    <div className="space-y-6">
                        <TaskList 
                            key={`tasks-${refreshKey}`}
                            goalId={goal.id} 
                            tasks={tasks}
                            startDate={goal.start_date}
                            endDate={goal.end_date}
                            onTasksChange={refreshData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
