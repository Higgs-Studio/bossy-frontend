'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Target, AlertTriangle, Frown, Meh, Smile, PartyPopper } from 'lucide-react';
import { markTaskDoneAction } from './actions';
import { useActionState, useState, useEffect } from 'react';
import type { Goal, BossEvent, DashboardKPIs, TaskWithStatus } from '@/lib/supabase/queries';
import { useRouter } from 'next/navigation';
import { getBossPersonality } from '@/lib/boss/reactions';
import { useTranslation } from '@/contexts/translation-context';
import { useToast } from '@/components/ui/toast';

type DashboardContentProps = {
    activeGoal: Goal | null;
    recentEvents: BossEvent[];
    bossType?: 'execution' | 'supportive' | 'mentor' | 'drill-sergeant';
    kpis: DashboardKPIs;
    dashboardTasks: TaskWithStatus[];
};

// Boss mood based on KPIs
type BossMood = 'thrilled' | 'happy' | 'neutral' | 'concerned' | 'angry';

function calculateBossMood(kpis: DashboardKPIs): BossMood {
    const { overdueCount, todayPendingCount } = kpis;
    const totalOutstanding = overdueCount + todayPendingCount;
    
    // Angry: High overdue tasks (3+)
    if (overdueCount >= 3) {
        return 'angry';
    }
    
    // Concerned: Some overdue (1-2)
    if (overdueCount > 0) {
        return 'concerned';
    }
    
    // Thrilled: No overdue AND no pending today (all done!)
    if (totalOutstanding === 0) {
        return 'thrilled';
    }
    
    // Happy: No overdue but has some pending today
    if (todayPendingCount <= 2) {
        return 'happy';
    }
    
    // Neutral: Everything else (many pending today)
    return 'neutral';
}

type BossMoods = Record<string, Record<string, string[]>>;

function getBossMoodMessage(
    mood: BossMood,
    bossName: string,
    bossType: string | undefined,
    moodMessages?: BossMoods,
): string {
    const type = bossType || 'execution';
    const messages = moodMessages?.[type]?.[mood];
    if (messages && messages.length > 0) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        return `${bossName}: ${msg}`;
    }
    return `${bossName}: ...`;
}

function getBossMoodColor(mood: BossMood): string {
    const colors = {
        thrilled: 'from-green-500 to-emerald-500',
        happy: 'from-blue-500 to-cyan-500',
        neutral: 'from-gray-500 to-slate-500',
        concerned: 'from-yellow-500 to-orange-500',
        angry: 'from-red-500 to-rose-600',
    };
    return colors[mood];
}

function getBossMoodEmoji(mood: BossMood) {
    const emojis = {
        thrilled: PartyPopper,
        happy: Smile,
        neutral: Meh,
        concerned: Frown,
        angry: AlertTriangle,
    };
    return emojis[mood];
}

export function DashboardContent({
    activeGoal,
    recentEvents,
    bossType,
    kpis,
    dashboardTasks,
}: DashboardContentProps) {
    const { t, locale } = useTranslation();
    const { toast } = useToast();
    const router = useRouter();
    const [actionState, formAction, isPending] = useActionState(
        markTaskDoneAction,
        null
    );

    const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

    useEffect(() => {
        if (!isPending && actionState?.success) {
            toast(actionState.success);
            setPendingTaskId(null);
            router.refresh();
        }
    }, [isPending, actionState, router, toast]);

    const today = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date());

    // Calculate boss mood
    const boss = getBossPersonality(bossType);
    const bossMood = calculateBossMood(kpis);
    const moodMessage = getBossMoodMessage(bossMood, boss.name, bossType, t.boss.moods as BossMoods);
    const moodColor = getBossMoodColor(bossMood);
    const MoodIcon = getBossMoodEmoji(bossMood);

    return (
        <div className="flex-1 p-6 lg:p-12 bg-gradient-to-br from-background to-muted/30">
            <div className="max-w-6xl mx-auto space-y-8">
                {!activeGoal ? (
                    <>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                                {t.dashboard.title}
                            </h1>
                            <p className="text-muted-foreground text-base">{today}</p>
                        </div>
                        <Card className="border border-border hover:shadow-xl transition-all duration-200 bg-card">
                            <CardContent className="pt-8 pb-8">
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                                        <Target className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-3">
                                        {t.dashboard.noGoal.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                        {t.dashboard.noGoal.description}
                                    </p>
                                    <Button size="lg" asChild>
                                        <a href="/app/goal">{t.dashboard.noGoal.cta}</a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
                        {/* Header with Boss Mood */}
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                                    {t.dashboard.performanceReport}
                                </h1>
                                <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-border">
                                    <Image
                                        src={boss.avatar}
                                        alt={boss.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                                    {boss.name}
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-sm">{today}</p>
                        </div>

                        {/* Boss Mood Card - Subtle Design */}
                        <Card className="border border-border bg-card hover:shadow-xl transition-all duration-200">
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${moodColor} flex items-center justify-center shadow-lg`}>
                                        <MoodIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                {t.dashboard.bossFeedback}
                                            </span>
                                        </div>
                                        <p className="text-base lg:text-lg font-medium text-foreground leading-relaxed">
                                            {moodMessage}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* KPI Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* (A) Overdue Tasks - before today, not done */}
                            <Card className={`border-2 transition-all duration-200 ${
                                kpis.overdueCount > 0 
                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                                    : 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            }`}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-full ${
                                            kpis.overdueCount > 0 
                                                ? 'bg-red-100 dark:bg-red-900/30' 
                                                : 'bg-emerald-100 dark:bg-emerald-900/30'
                                        }`}>
                                            <AlertTriangle className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-3xl lg:text-4xl font-bold text-foreground">
                                                {kpis.overdueCount}
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {t.dashboard.overdueTasks}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t.dashboard.overdueTasksDesc}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* (B) Today's Tasks - dated today, not done */}
                            <Card className={`border-2 transition-all duration-200 ${
                                kpis.todayPendingCount > 0 
                                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' 
                                    : 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            }`}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-full ${
                                            kpis.todayPendingCount > 0 
                                                ? 'bg-yellow-500' 
                                                : 'bg-green-500'
                                        }`}>
                                            <Clock className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-3xl lg:text-4xl font-bold text-foreground">
                                                {kpis.todayPendingCount}
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {t.dashboard.todaysTasks}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t.dashboard.todaysTasksDesc}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Outstanding Tasks for Today */}
                        <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{t.dashboard.outstandingTasks}</CardTitle>
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                        {dashboardTasks.length} {t.dashboard.outstanding}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {dashboardTasks.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                                        <p className="font-medium">{t.common.allCaughtUp}</p>
                                        <p className="text-sm">{t.dashboard.noOutstandingTasks}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {dashboardTasks.map((task) => {
                                            const isOverdue = task.status === 'overdue';
                                            const isPending = task.status === 'pending';
                                            
                                            return (
                                                <div
                                                    key={task.id}
                                                    className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${
                                                        isOverdue
                                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-950/10'
                                                            : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/10'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                                            isOverdue ? 'bg-red-500' : 'bg-yellow-500'
                                                        }`}>
                                                            {isOverdue ? (
                                                                <AlertTriangle className="h-4 w-4 text-white" />
                                                            ) : (
                                                                <Clock className="h-4 w-4 text-white" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                {/* Date badge */}
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                                    isPending
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-red-500 text-white'
                                                                } uppercase`}>
                                                                    {isPending ? t.dashboard.badges.today : new Intl.DateTimeFormat(locale, { 
                                                                        month: 'short', 
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    }).format(new Date(task.task_date))}
                                                                </span>
                                                                {/* Status badge */}
                                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                                                    isOverdue
                                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                                } uppercase`}>
                                                                    {isOverdue ? t.dashboard.badges.overdue : t.dashboard.badges.pending}
                                                                </span>
                                                            </div>
                                                            <p className="text-base text-foreground font-medium leading-relaxed">
                                                                {task.task_text}
                                                            </p>
                                                        </div>
                                                        {/* Done button for all tasks */}
                                                        <form action={formAction} className="flex-shrink-0" onSubmit={() => setPendingTaskId(task.id)}>
                                                            <input type="hidden" name="taskId" value={task.id} />
                                                            <Button
                                                                type="submit"
                                                                size="sm"
                                                                disabled={pendingTaskId === task.id}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                {pendingTaskId === task.id ? t.dashboard.processing : t.common.done}
                                                            </Button>
                                                        </form>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

            </div>
        </div>
    );
}

