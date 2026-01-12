'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, Target, MessageSquare, Trash2, Check } from 'lucide-react';
import { checkInAction, markMissedAction, abandonGoalAction, completeGoalAction } from './actions';
import { useActionState } from 'react';
import type { Goal, DailyTask, CheckIn, BossEvent } from '@/lib/supabase/queries';
import { getBossPersonality } from '@/lib/boss/reactions';
import { useTranslation } from '@/contexts/translation-context';

type DashboardContentProps = {
    activeGoal: Goal | null;
    todayTask: DailyTask | null;
    checkIn: CheckIn | null;
    isMissed: boolean;
    recentEvents: BossEvent[];
    bossType?: 'execution' | 'supportive' | 'mentor' | 'drill-sergeant';
};

export function DashboardContent({
    activeGoal,
    todayTask,
    checkIn,
    isMissed,
    recentEvents,
    bossType,
}: DashboardContentProps) {
    const { t } = useTranslation();
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
    // Round to 2 decimal places to prevent hydration mismatch
    const progressRounded = Math.round(progress * 100) / 100;

    return (
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                        {t.dashboard?.title || 'Dashboard'}
                    </h1>
                    <p className="text-muted-foreground text-lg">{today}</p>
                </div>

                {!activeGoal ? (
                    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-muted to-muted/80 mb-6">
                                    <Target className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                    {t.dashboard?.noGoal?.title || 'No active goal'}
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    {t.dashboard?.noGoal?.description || 'Create a goal to get started with daily accountability.'}
                                </p>
                                <Button size="lg" asChild>
                                    <a href="/app/goal">{t.dashboard?.noGoal?.cta || 'Create Goal'}</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{t.dashboard?.activeGoal || 'Active Goal'}</CardTitle>
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                        {t.dashboard?.inProgress || 'In Progress'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground mb-3">{activeGoal.title}</h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">{t.goal?.intensity || 'Intensity'}:</span>
                                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold capitalize border border-indigo-500/20">
                                                    {activeGoal.intensity}
                                                </span>
                                            </div>
                                            <span className="text-muted-foreground/50">•</span>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    {new Date(activeGoal.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(activeGoal.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm items-center">
                                            <span className="text-muted-foreground font-medium">{t.dashboard?.goalProgress || 'Goal Progress'}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-foreground font-bold text-lg">{Math.round(progress)}%</span>
                                                <span className="text-muted-foreground text-xs">{t.dashboard?.complete || 'Complete'}</span>
                                            </div>
                                        </div>
                                        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progressRounded}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{t.dashboard?.started || 'Started'} {new Date(activeGoal.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            <span>{t.dashboard?.ends || 'Ends'} {new Date(activeGoal.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Goal Management Card */}
                        <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
                            <CardHeader>
                                <CardTitle>{t.dashboard?.goalManagement || 'Goal Management'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {t.dashboard?.managementDescription || 'Manage your active goal. Remember: commitments matter.'}
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
                                                    t.dashboard?.processing || 'Processing...'
                                                ) : (
                                                    <>
                                                        <Check className="mr-2 h-4 w-4" />
                                                        {t.dashboard?.markComplete || 'Mark Goal Complete'}
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                        <form action={abandonFormAction} className="flex-1">
                                            <input type="hidden" name="goalId" value={activeGoal.id} />
                                            <Button 
                                                type="submit" 
                                                variant="outline"
                                                className="w-full border-2 border-border text-foreground hover:bg-muted hover:border-border/80"
                                                disabled={isAbandonPending}
                                            >
                                                {isAbandonPending ? (
                                                    t.dashboard?.processing || 'Processing...'
                                                ) : (
                                                    <>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t.dashboard?.abandonGoal || 'Abandon Goal'}
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                    {(abandonState?.error || completeState?.error) && (
                                        <div className="text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/50 p-3 rounded-lg border border-red-200 dark:border-red-900">
                                            {abandonState?.error || completeState?.error}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {todayTask && (
                            <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{t.dashboard?.todaysTask || "Today's Task"}</CardTitle>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                            <p className="text-base text-foreground leading-relaxed font-medium">{todayTask.task_text}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {checkInStatus === 'completed' && (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-foreground font-medium text-sm">
                                                        {t.dashboard?.completed || 'Completed'}
                                                    </span>
                                                </div>
                                            )}
                                            {checkInStatus === 'missed' && (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-foreground font-medium text-sm">{t.dashboard?.missed || 'Missed'}</span>
                                                </div>
                                            )}
                                            {checkInStatus === 'pending' && (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-foreground font-medium text-sm">
                                                        {t.dashboard?.pending || 'Pending'}
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
                                                    {isCheckInPending ? (t.dashboard?.marking || 'Marking...') : (t.dashboard?.markDone || 'Mark Done')}
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
                                                        ? (t.dashboard?.processing || 'Processing...')
                                                        : (t.dashboard?.explainMissed || 'Explain Why Missed')}
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {recentEvents.length > 0 && bossType && (
                            <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{t.dashboard?.activityHistory || 'Activity History'}</CardTitle>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {t.dashboard?.lastNMessages?.replace('{count}', recentEvents.length.toString()) || `Last ${recentEvents.length} messages`}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentEvents.map((event) => {
                                            const context = event.context as { message?: string } | null;
                                            const boss = getBossPersonality(bossType);
                                            return (
                                                <div
                                                    key={event.id}
                                                    className="p-5 bg-muted/50 rounded-lg border border-border hover:border-border/80 hover:shadow-sm transition-all duration-200"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={boss.avatar}
                                                                alt={boss.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-semibold text-foreground">{boss.name}</span>
                                                                <span className="text-xs text-muted-foreground">•</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(event.created_at).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p className="text-base text-foreground leading-relaxed">
                                                                {context?.message || (t.dashboard?.noMessage || 'No message')}
                                                            </p>
                                                        </div>
                                                    </div>
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

