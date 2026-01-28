'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Target, AlertTriangle, Frown, Meh, Smile, PartyPopper, X as CloseIcon } from 'lucide-react';
import { markTaskDoneAction } from './actions';
import { useActionState, useState, useEffect } from 'react';
import type { Goal, BossEvent, DashboardKPIs, TaskWithStatus } from '@/lib/supabase/queries';
import { useRouter } from 'next/navigation';
import { getBossPersonality } from '@/lib/boss/reactions';
import { useTranslation } from '@/contexts/translation-context';

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

function getBossMoodMessage(mood: BossMood, bossName: string, bossType?: 'execution' | 'supportive' | 'mentor' | 'drill-sergeant'): string {
    const messagesByType = {
        execution: {
            thrilled: [
                `${bossName}: Excellent execution. This is the standard. Keep it exactly like this.`,
                `${bossName}: Your consistency speaks volumes. This is what commitment looks like.`,
                `${bossName}: Outstanding. You're showing everyone what's possible.`,
            ],
            happy: [
                `${bossName}: Good. You're staying on track. Don't let up.`,
                `${bossName}: Solid performance. Now maintain this momentum.`,
                `${bossName}: You're doing what you said you'd do. That's what matters.`,
            ],
            neutral: [
                `${bossName}: I'm watching. Show me you're serious about this.`,
                `${bossName}: You can do better. I know you can.`,
                `${bossName}: Time to prove what you're capable of.`,
            ],
            concerned: [
                `${bossName}: This isn't the performance I expected from you.`,
                `${bossName}: You're falling behind. We need to talk about this.`,
                `${bossName}: Your numbers are slipping. What's going on?`,
            ],
            angry: [
                `${bossName}: This is completely unacceptable. Explain yourself.`,
                `${bossName}: I trusted you with this goal. Don't waste that trust.`,
                `${bossName}: Either fix this now, or we're done here.`,
            ],
        },
        supportive: {
            thrilled: [
                `${bossName}: I KNEW you could do it! You're absolutely amazing!`,
                `${bossName}: Look at you GO! I'm so incredibly proud of you!`,
                `${bossName}: You're doing phenomenally! Keep this amazing energy!`,
            ],
            happy: [
                `${bossName}: You're doing great! I'm really proud of your effort!`,
                `${bossName}: Nice work! You're building something wonderful here.`,
                `${bossName}: You're showing up every day. That's what counts!`,
            ],
            neutral: [
                `${bossName}: I believe in you. Let's get back on track together.`,
                `${bossName}: You've got this. Just need to refocus a bit.`,
                `${bossName}: No worries, we all have off days. Let's bounce back!`,
            ],
            concerned: [
                `${bossName}: Hey, I'm a bit worried about you. Everything okay?`,
                `${bossName}: Let's work through this together. What's holding you back?`,
                `${bossName}: I know you're trying. Let's figure out what's not working.`,
            ],
            angry: [
                `${bossName}: I'm really concerned now. We need to talk about what's happening.`,
                `${bossName}: This isn't like you. Please tell me what's going on.`,
                `${bossName}: I care about you, but this pattern needs to change. Soon.`,
            ],
        },
        mentor: {
            thrilled: [
                `${bossName}: Remarkable discipline. You understand the practice now.`,
                `${bossName}: This level of consistency reveals mastery. Well done.`,
                `${bossName}: You've internalized the lesson. This is true progress.`,
            ],
            happy: [
                `${bossName}: Good practice. Reflect on what made today successful.`,
                `${bossName}: Your effort is evident. Keep observing your patterns.`,
                `${bossName}: Steady progress. This is how wisdom accumulates.`,
            ],
            neutral: [
                `${bossName}: Pause and reflect. What is your practice showing you?`,
                `${bossName}: The path requires presence. Are you truly here?`,
                `${bossName}: Notice the resistance. What is it teaching you?`,
            ],
            concerned: [
                `${bossName}: Your pattern reveals something. Time to reflect deeply.`,
                `${bossName}: Setbacks are teachers. What is this one telling you?`,
                `${bossName}: The struggle points to something important. Investigate it.`,
            ],
            angry: [
                `${bossName}: This pattern demands serious reflection. Why this resistance?`,
                `${bossName}: You're avoiding the real work. Face it honestly.`,
                `${bossName}: Is this goal aligned with your truth? Question deeply.`,
            ],
        },
        'drill-sergeant': {
            thrilled: [
                `${bossName}: HELL YEAH! THAT'S WHAT I'M TALKING ABOUT!`,
                `${bossName}: YOU'RE A MACHINE! KEEP DESTROYING THOSE GOALS!`,
                `${bossName}: NOW THAT'S EXECUTION! THIS IS YOUR STANDARD!`,
            ],
            happy: [
                `${bossName}: Good work! But don't get comfortable. NEXT!`,
                `${bossName}: Decent! Now do it again tomorrow. NO EXCUSES!`,
                `${bossName}: You showed up. That's expected. Keep going!`,
            ],
            neutral: [
                `${bossName}: Come on! I know you've got MORE in you! SHOW ME!`,
                `${bossName}: Is this REALLY your best? I don't think so. DIG DEEPER!`,
                `${bossName}: Time to turn it up! NO MORE COASTING!`,
            ],
            concerned: [
                `${bossName}: What happened to you?! Where's that FIRE?!`,
                `${bossName}: This is NOT acceptable! Get it together RIGHT NOW!`,
                `${bossName}: You're SLIPPING! Time to WAKE UP!`,
            ],
            angry: [
                `${bossName}: ARE YOU KIDDING ME?! THIS IS PATHETIC!`,
                `${bossName}: UNACCEPTABLE! You're better than this! PROVE IT!`,
                `${bossName}: ENOUGH! Either COMMIT or QUIT! Which is it?!`,
            ],
        },
    };
    
    const messages = messagesByType[bossType || 'execution'][mood];
    return messages[Math.floor(Math.random() * messages.length)];
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
    const { t } = useTranslation();
    const router = useRouter();
    const [actionState, formAction, isPending] = useActionState(
        markTaskDoneAction,
        null
    );

    const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState<{show: boolean; message: string}>({
        show: false,
        message: ''
    });

    const showNotification = (message: string) => {
        setShowSuccessMessage({ show: true, message });
        setTimeout(() => {
            setShowSuccessMessage({ show: false, message: '' });
        }, 4000);
    };

    // Watch for successful action and refresh page
    useEffect(() => {
        if (!isPending && actionState?.success) {
            showNotification(actionState.success);
            setPendingTaskId(null);
            router.refresh();
        }
    }, [isPending, actionState, router]);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Calculate boss mood
    const boss = getBossPersonality(bossType);
    const bossMood = calculateBossMood(kpis);
    const moodMessage = getBossMoodMessage(bossMood, boss.name, bossType);
    const moodColor = getBossMoodColor(bossMood);
    const MoodIcon = getBossMoodEmoji(bossMood);

    return (
        <div className="flex-1 p-6 lg:p-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="max-w-6xl mx-auto space-y-8">
                {!activeGoal ? (
                    <>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                                {t.dashboard?.title || 'Dashboard'}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-base">{today}</p>
                        </div>
                        <Card className="border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-200 bg-white dark:bg-slate-800">
                            <CardContent className="pt-8 pb-8">
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
                                        <Target className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                        {t.dashboard?.noGoal?.title || 'No active goal'}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                        {t.dashboard?.noGoal?.description || 'Create a goal to get started with daily accountability.'}
                                    </p>
                                    <Button size="lg" asChild>
                                        <a href="/app/goal">{t.dashboard?.noGoal?.cta || 'Create Goal'}</a>
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
                                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                                    Performance Report to
                                </h1>
                                <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                                    <Image
                                        src={boss.avatar}
                                        alt={boss.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                                    {boss.name}
                                </h1>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{today}</p>
                        </div>

                        {/* Boss Mood Card - Subtle Design */}
                        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-200">
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${moodColor} flex items-center justify-center shadow-lg`}>
                                        <MoodIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                                Boss Feedback
                                            </span>
                                        </div>
                                        <p className="text-base lg:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
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
                                                Overdue Tasks
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tasks from previous days that are not yet completed
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
                                                Today's Tasks
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tasks scheduled for today that are pending completion
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
                                    <CardTitle>Outstanding Tasks for Today</CardTitle>
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                        {dashboardTasks.length} outstanding
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {dashboardTasks.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                                        <p className="font-medium">All caught up!</p>
                                        <p className="text-sm">No overdue or pending tasks</p>
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
                                                                }`}>
                                                                    {isPending ? 'TODAY' : new Date(task.task_date).toLocaleDateString('en-US', { 
                                                                        month: 'short', 
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                                {/* Status badge */}
                                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                                                    isOverdue
                                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                                }`}>
                                                                    {isOverdue ? 'OVERDUE' : 'PENDING'}
                                                                </span>
                                                            </div>
                                                            <p className="text-base text-slate-900 dark:text-white font-medium leading-relaxed">
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
                                                                {pendingTaskId === task.id ? '...' : 'Done'}
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

                {/* Success Message */}
                {showSuccessMessage.show && (
                    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                        <Card className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 shadow-xl">
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                            {showSuccessMessage.message}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowSuccessMessage({ show: false, message: '' })}
                                        className="flex-shrink-0 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                    >
                                        <CloseIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

