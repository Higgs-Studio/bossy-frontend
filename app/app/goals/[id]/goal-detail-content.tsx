'use client';

import { useState } from 'react';
import { EditGoalForm } from './edit-goal-form';
import { TaskList } from './task-list';
import { GoalCalendar } from './goal-calendar';
import { getGoalWithTasks } from './actions';
import { useTranslation } from '@/contexts/translation-context';
import type { Goal, DailyTask } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { logError } from '@/lib/utils/logger';

type GoalDetailContentProps = {
    goal: Goal;
    tasks: DailyTask[];
};

export function GoalDetailContent({ goal: initialGoal, tasks: initialTasks }: GoalDetailContentProps) {
    const { t } = useTranslation();
    const [goal, setGoal] = useState(initialGoal);
    const [tasks, setTasks] = useState(initialTasks);
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshData = async () => {
        try {
            const data = await getGoalWithTasks(goal.id);
            if (!data.goal) return;
            setGoal(data.goal);
            setTasks(data.tasks);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            logError('Error refreshing goal data', error, { goalId: goal.id });
        }
    };

    const start = new Date(goal.start_date);
    const end = new Date(goal.end_date);
    const timeHorizon = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-background to-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href="/app/goals">
                            <ArrowLeft className="h-4 w-4" />
                            {t.nav?.back || 'Back'}
                        </Link>
                    </Button>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                        {t.editGoal?.title || 'Edit Goal'}: {goal.title}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <EditGoalForm goal={goal} timeHorizon={timeHorizon} />
                        <GoalCalendar
                            key={`calendar-${refreshKey}`}
                            tasks={tasks}
                            startDate={goal.start_date}
                            endDate={goal.end_date}
                        />
                    </div>
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
