'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, Target, Flame, AlertTriangle, Trophy, Frown, Meh, Smile, PartyPopper, X as CloseIcon } from 'lucide-react';
import { checkInAction, markMissedAction } from './actions';
import { useActionState, useState, useEffect } from 'react';
import type { Goal, DailyTask, CheckIn, BossEvent, DashboardKPIs, TaskWithStatus } from '@/lib/supabase/queries';
import { getBossPersonality } from '@/lib/boss/reactions';
import { useTranslation } from '@/contexts/translation-context';

type DashboardContentProps = {
    activeGoal: Goal | null;
    todayTasks: DailyTask[];
    recentEvents: BossEvent[];
    bossType?: 'execution' | 'supportive' | 'mentor' | 'drill-sergeant';
    kpis: DashboardKPIs;
    dashboardTasks: TaskWithStatus[];
};

// Boss mood based on KPIs
type BossMood = 'thrilled' | 'happy' | 'neutral' | 'concerned' | 'angry';

function calculateBossMood(kpis: DashboardKPIs, todayCompleted: boolean): BossMood {
    const { overdueCount, currentStreak, completionRate } = kpis;
    
    // Angry: High overdue tasks (3+) OR very low completion rate (<40%)
    if (overdueCount >= 3 || (completionRate < 40 && kpis.totalTasks > 5)) {
        return 'angry';
    }
    
    // Concerned: Some overdue (1-2) OR low completion (<60%)
    if (overdueCount > 0 || (completionRate < 60 && kpis.totalTasks > 5)) {
        return 'concerned';
    }
    
    // Thrilled: Today completed + good streak (3+) + high completion (80%+)
    if (todayCompleted && currentStreak >= 3 && completionRate >= 80) {
        return 'thrilled';
    }
    
    // Happy: Today completed OR decent streak OR good completion
    if (todayCompleted || currentStreak >= 2 || completionRate >= 70) {
        return 'happy';
    }
    
    // Neutral: Everything else
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
    todayTasks,
    recentEvents,
    bossType,
    kpis,
    dashboardTasks,
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

    // Watch for successful check-in
    useEffect(() => {
        if (!isCheckInPending && checkInState?.success) {
            showNotification(checkInState.success);
        }
    }, [isCheckInPending, checkInState]);

    // Watch for successful missed marking
    useEffect(() => {
        if (!isMissedPending && missedState?.success) {
            showNotification(missedState.success);
        }
    }, [isMissedPending, missedState]);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Calculate boss mood
    const boss = getBossPersonality(bossType);
    const todayCompleted = kpis.todayCompleted > 0;
    const bossMood = calculateBossMood(kpis, todayCompleted);
    const moodMessage = getBossMoodMessage(bossMood, boss.name, bossType);
    const moodColor = getBossMoodColor(bossMood);
    const MoodIcon = getBossMoodEmoji(bossMood);

    return (
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
            <div className="max-w-5xl mx-auto space-y-6">
                {!activeGoal ? (
                    <>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                                {t.dashboard?.title || 'Dashboard'}
                            </h1>
                            <p className="text-muted-foreground text-lg">{today}</p>
                        </div>
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
                    </>
                ) : (
                    <>
                        {/* Header with Boss Mood */}
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                                    Performance Report to
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

                        {/* Boss Mood Card */}
                        <Card className={`border-2 bg-gradient-to-br ${moodColor} text-white shadow-xl`}>
                            <CardContent className="pt-6 pb-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <MoodIcon className="h-8 w-8 lg:h-10 lg:w-10" />
                                        <p className="text-xl lg:text-2xl font-bold text-center">
                                            {moodMessage}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* KPI Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Today's Task */}
                            <Card className={`border-2 transition-all duration-200 ${
                                todayCompleted 
                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                                    : kpis.overdueCount > 0 
                                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                        : 'border-border'
                            }`}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`p-3 rounded-full ${
                                            todayCompleted 
                                                ? 'bg-green-500' 
                                                : 'bg-muted'
                                        }`}>
                                            {todayCompleted ? (
                                                <CheckCircle2 className="h-6 w-6 text-white" />
                                            ) : (
                                                <Clock className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <p className="text-2xl lg:text-3xl font-bold text-foreground">
                                            {todayCompleted ? '✓' : '...'}
                                        </p>
                                        <p className="text-xs text-muted-foreground text-center font-medium">
                                            Today's Task
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Overdue Tasks */}
                            <Card className={`border-2 transition-all duration-200 ${
                                kpis.overdueCount > 0 
                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                                    : 'border-border'
                            }`}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`p-3 rounded-full ${
                                            kpis.overdueCount > 0 
                                                ? 'bg-red-500' 
                                                : 'bg-green-500'
                                        }`}>
                                            <AlertTriangle className="h-6 w-6 text-white" />
                                        </div>
                                        <p className="text-2xl lg:text-3xl font-bold text-foreground">
                                            {kpis.overdueCount}
                                        </p>
                                        <p className="text-xs text-muted-foreground text-center font-medium">
                                            Overdue Tasks
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Current Streak */}
                            <Card className={`border-2 transition-all duration-200 ${
                                kpis.currentStreak >= 3 
                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' 
                                    : 'border-border'
                            }`}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`p-3 rounded-full ${
                                            kpis.currentStreak >= 3 
                                                ? 'bg-orange-500' 
                                                : 'bg-muted'
                                        }`}>
                                            <Flame className="h-6 w-6 text-white" />
                                        </div>
                                        <p className="text-2xl lg:text-3xl font-bold text-foreground">
                                            {kpis.currentStreak}
                                        </p>
                                        <p className="text-xs text-muted-foreground text-center font-medium">
                                            Day Streak
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Completion Rate */}
                            <Card className={`border-2 transition-all duration-200 ${
                                kpis.completionRate >= 80 
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                                    : kpis.completionRate >= 60
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                        : 'border-border'
                            }`}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`p-3 rounded-full ${
                                            kpis.completionRate >= 80 
                                                ? 'bg-purple-500' 
                                                : kpis.completionRate >= 60
                                                    ? 'bg-blue-500'
                                                    : 'bg-muted'
                                        }`}>
                                            <Trophy className="h-6 w-6 text-white" />
                                        </div>
                                        <p className="text-2xl lg:text-3xl font-bold text-foreground">
                                            {kpis.completionRate.toFixed(0)}%
                                        </p>
                                        <p className="text-xs text-muted-foreground text-center font-medium">
                                            Completion Rate
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Task List */}
                        <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Task Status Report</CardTitle>
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                        {kpis.completedTasks} / {kpis.totalTasks} completed
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {dashboardTasks.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No tasks to display
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {dashboardTasks.map((task) => {
                                            const isToday = task.task_date === new Date().toISOString().split('T')[0];
                                            const isPast = task.task_date < new Date().toISOString().split('T')[0];
                                            
                                            return (
                                                <div
                                                    key={task.id}
                                                    className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${
                                                        task.status === 'completed'
                                                            ? 'border-green-500 bg-green-50/50 dark:bg-green-950/10'
                                                            : task.status === 'missed'
                                                                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/10'
                                                                : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/10'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                                            task.status === 'completed'
                                                                ? 'bg-green-500'
                                                                : task.status === 'missed'
                                                                    ? 'bg-red-500'
                                                                    : 'bg-yellow-500'
                                                        }`}>
                                                            {task.status === 'completed' && (
                                                                <CheckCircle2 className="h-4 w-4 text-white" />
                                                            )}
                                                            {task.status === 'missed' && (
                                                                <XCircle className="h-4 w-4 text-white" />
                                                            )}
                                                            {task.status === 'pending' && (
                                                                <Clock className="h-4 w-4 text-white" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                                    isToday
                                                                        ? 'bg-blue-500 text-white'
                                                                        : isPast && task.status !== 'completed'
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'bg-muted text-muted-foreground'
                                                                }`}>
                                                                    {isToday ? 'TODAY' : new Date(task.task_date).toLocaleDateString('en-US', { 
                                                                        month: 'short', 
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                                                    task.status === 'completed'
                                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                                        : task.status === 'missed'
                                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                                }`}>
                                                                    {task.status === 'completed' && '✓ COMPLETED'}
                                                                    {task.status === 'missed' && '✗ MISSED'}
                                                                    {task.status === 'pending' && '⏰ PENDING'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-foreground font-medium">
                                                                {task.task_text}
                                                            </p>
                                                        </div>
                                                        {task.status === 'pending' && isToday && (
                                                            <form action={checkInFormAction} className="flex-shrink-0">
                                                                <input type="hidden" name="taskId" value={task.id} />
                                                                <Button
                                                                    type="submit"
                                                                    size="sm"
                                                                    disabled={isCheckInPending}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    {isCheckInPending ? '...' : 'Done'}
                                                                </Button>
                                                            </form>
                                                        )}
                                                        {task.status === 'missed' && isPast && (
                                                            <form action={missedFormAction} className="flex-shrink-0">
                                                                <input type="hidden" name="taskId" value={task.id} />
                                                                <Button
                                                                    type="submit"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={isMissedPending}
                                                                >
                                                                    {isMissedPending ? '...' : 'Ack'}
                                                                </Button>
                                                            </form>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>


                        {/* Boss Feedback History */}
                        {recentEvents.length > 0 && bossType && (
                            <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Recent Feedback from {boss.name}</CardTitle>
                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                            Last {recentEvents.length} messages
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentEvents.map((event) => {
                                            const context = event.context as { message?: string } | null;
                                            const eventColor = 
                                                event.event_type === 'praise' 
                                                    ? 'border-green-500 bg-green-50/50 dark:bg-green-950/10'
                                                    : event.event_type === 'warning'
                                                        ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/10'
                                                        : 'border-red-500 bg-red-50/50 dark:bg-red-950/10';
                                            return (
                                                <div
                                                    key={event.id}
                                                    className={`p-4 rounded-lg border-l-4 ${eventColor} transition-all duration-200`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-border">
                                                            <Image
                                                                src={boss.avatar}
                                                                alt={boss.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-bold text-foreground">{boss.name}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(event.created_at).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-foreground leading-relaxed">
                                                                {context?.message || 'No message'}
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

                {/* Success Message */}
                {showSuccessMessage.show && (
                    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                        <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 shadow-lg">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                            {showSuccessMessage.message}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowSuccessMessage({ show: false, message: '' })}
                                        className="flex-shrink-0 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                                    >
                                        <CloseIcon className="h-4 w-4" />
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

