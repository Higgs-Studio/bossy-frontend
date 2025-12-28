'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, Target, MessageSquare, Trash2, Check } from 'lucide-react';
import { checkInAction, markMissedAction, abandonGoalAction, completeGoalAction } from './actions';
import { useActionState } from 'react';
import type { Goal, DailyTask, CheckIn, BossEvent } from '@/lib/supabase/queries';

type DashboardContentProps = {
    activeGoal: Goal | null;
    todayTask: DailyTask | null;
    checkIn: CheckIn | null;
    isMissed: boolean;
    recentEvents: BossEvent[];
};

export function DashboardContent({
    activeGoal,
    todayTask,
    checkIn,
    isMissed,
    recentEvents,
}: DashboardContentProps) {
    const [checkInState, checkInFormAction, isCheckInPending] = useActionState(
        checkInAction,
        null
    );
    const [missedState, missedFormAction, isMissedPending] = useActionState(
        markMissedAction,
        null
    );
    const [abandonState, abandonFormAction, isAbandonPending] = useActionState(
        abandonGoalAction,
        null
    );
    const [completeState, completeFormAction, isCompletePending] = useActionState(
        completeGoalAction,
        null
    );

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const checkInStatus = checkIn
        ? checkIn.status === 'done'
            ? 'completed'
            : 'missed'
        : isMissed
            ? 'missed'
            : 'pending';

    // Calculate goal progress
    const calculateProgress = () => {
        if (!activeGoal) return 0;
        const start = new Date(activeGoal.start_date).getTime();
        const end = new Date(activeGoal.end_date).getTime();
        const now = new Date().getTime();
        const total = end - start;
        const elapsed = now - start;
        return Math.min(Math.max((elapsed / total) * 100, 0), 100);
    };

    const progress = calculateProgress();

    return (
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                        Dashboard
                    </h1>
                    <p className="text-slate-600 text-lg">{today}</p>
                </div>

                {!activeGoal ? (
                    <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-6">
                                    <Target className="h-10 w-10 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                    No active goal
                                </h3>
                                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                    Create a goal to get started with daily accountability.
                                </p>
                                <Button size="lg" asChild>
                                    <a href="/app/goal">Create Goal</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Active Goal</CardTitle>
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                        In Progress
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{activeGoal.title}</h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-600">Intensity:</span>
                                                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold capitalize border border-indigo-200">
                                                    {activeGoal.intensity}
                                                </span>
                                            </div>
                                            <span className="text-slate-400">•</span>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    {new Date(activeGoal.start_date).toLocaleDateString()} - {new Date(activeGoal.end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm items-center">
                                            <span className="text-slate-600 font-medium">Goal Progress</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-900 font-bold text-lg">{Math.round(progress)}%</span>
                                                <span className="text-slate-500 text-xs">Complete</span>
                                            </div>
                                        </div>
                                        <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Started {new Date(activeGoal.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            <span>Ends {new Date(activeGoal.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Goal Management Card */}
                        <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                            <CardHeader>
                                <CardTitle>Goal Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600 mb-4">
                                        Manage your active goal. Remember: commitments matter.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <form action={completeFormAction} className="flex-1">
                                            <input type="hidden" name="goalId" value={activeGoal.id} />
                                            <Button 
                                                type="submit" 
                                                variant="default"
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                                disabled={isCompletePending}
                                            >
                                                {isCompletePending ? (
                                                    'Processing...'
                                                ) : (
                                                    <>
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Mark Goal Complete
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                        <form action={abandonFormAction} className="flex-1">
                                            <input type="hidden" name="goalId" value={activeGoal.id} />
                                            <Button 
                                                type="submit" 
                                                variant="outline"
                                                className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400"
                                                disabled={isAbandonPending}
                                            >
                                                {isAbandonPending ? (
                                                    'Processing...'
                                                ) : (
                                                    <>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Abandon Goal
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                    {(abandonState?.error || completeState?.error) && (
                                        <div className="text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                                            {abandonState?.error || completeState?.error}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {todayTask && (
                            <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Today&apos;s Task</CardTitle>
                                        <span className="text-xs text-slate-500">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <p className="text-base text-slate-800 leading-relaxed font-medium">{todayTask.task_text}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {checkInStatus === 'completed' && (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                                                    <CheckCircle2 className="h-4 w-4 text-slate-600" />
                                                    <span className="text-slate-700 font-medium text-sm">
                                                        Completed
                                                    </span>
                                                </div>
                                            )}
                                            {checkInStatus === 'missed' && (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                                                    <XCircle className="h-4 w-4 text-slate-600" />
                                                    <span className="text-slate-700 font-medium text-sm">Missed</span>
                                                </div>
                                            )}
                                            {checkInStatus === 'pending' && (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                                                    <Clock className="h-4 w-4 text-slate-600" />
                                                    <span className="text-slate-700 font-medium text-sm">
                                                        Pending
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {checkInStatus === 'pending' && (
                                            <form action={checkInFormAction}>
                                                <input
                                                    type="hidden"
                                                    name="taskId"
                                                    value={todayTask.id}
                                                />
                                                <Button type="submit" disabled={isCheckInPending}>
                                                    {isCheckInPending ? 'Marking...' : 'Mark Done'}
                                                </Button>
                                            </form>
                                        )}

                                        {checkInStatus === 'missed' && !checkIn && (
                                            <form action={missedFormAction}>
                                                <input
                                                    type="hidden"
                                                    name="taskId"
                                                    value={todayTask.id}
                                                />
                                                <Button
                                                    type="submit"
                                                    variant="outline"
                                                    disabled={isMissedPending}
                                                >
                                                    {isMissedPending
                                                        ? 'Processing...'
                                                        : 'Explain Why Missed'}
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {recentEvents.length > 0 && (
                            <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Activity History</CardTitle>
                                        <span className="text-xs font-medium text-slate-600">Last {recentEvents.length} messages</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentEvents.map((event) => {
                                            const context = event.context as { message?: string } | null;
                                            return (
                                                <div
                                                    key={event.id}
                                                    className="p-5 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                                                >
                                                    <p className="text-base text-slate-800 leading-relaxed font-medium mb-2">
                                                        {context?.message || 'No message'}
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        {new Date(event.created_at).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

