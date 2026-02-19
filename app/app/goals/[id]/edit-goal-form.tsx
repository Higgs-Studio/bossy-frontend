'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateGoalAction } from '@/app/app/goal/actions';
import { Loader2, Target, CheckCircle2, XCircle, Zap, Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Goal } from '@/lib/supabase/queries';
import { useTranslation } from '@/contexts/translation-context';

type EditGoalFormProps = {
    goal: Goal;
    timeHorizon: number;
};

export function EditGoalForm({ goal, timeHorizon }: EditGoalFormProps) {
    const { t } = useTranslation();
    const [state, formAction, isPending] = useActionState(updateGoalAction, null);

    // Controlled state - all changes only persist when "Update Goal" is clicked
    const [title, setTitle] = useState(goal.title);
    const [intensity, setIntensity] = useState(goal.intensity);
    const [startDate, setStartDate] = useState<string>(goal.start_date);
    const [endDate, setEndDate] = useState<string>(goal.end_date);
    const [currentStatus, setCurrentStatus] = useState(goal.status);

    const handleStatusUpdate = (newStatus: 'active' | 'completed' | 'abandoned') => {
        setCurrentStatus(newStatus);
    };

    return (
        <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
            <CardHeader className="border-b border-border pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-5 w-5 text-primary" />
                    {t.editGoal.editDetails}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={formAction} className="space-y-8">
                    <input type="hidden" name="goalId" value={goal.id} />
                    {/* Hidden inputs to sync form values */}
                    <input type="hidden" name="intensity" value={intensity} />
                    <input type="hidden" name="startDate" value={startDate} />
                    <input type="hidden" name="endDate" value={endDate} />
                    <input type="hidden" name="status" value={currentStatus} />

                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-base font-semibold text-foreground">{t.goal.title}</Label>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            required
                            maxLength={200}
                            placeholder={t.goal.titlePlaceholder}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-11 text-base"
                        />
                    </div>

                    <div className="space-y-4 p-5 bg-muted/50 rounded-xl border border-border">
                        <div className="space-y-1">
                            <Label className="text-base font-semibold text-foreground">{t.editGoal.goalStatus}</Label>
                            <p className="text-sm text-muted-foreground">{t.editGoal.updateStatus}</p>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => handleStatusUpdate('active')}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                    currentStatus === 'active'
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-sm"
                                        : "border-border hover:border-border/80 hover:bg-muted/50"
                                )}
                            >
                                <Zap className={cn("h-6 w-6 mb-2", currentStatus === 'active' ? "text-emerald-600" : "text-muted-foreground")} />
                                <span className="font-medium text-sm">{t.goals.filterActive}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusUpdate('completed')}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                    currentStatus === 'completed'
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm"
                                        : "border-border hover:border-border/80 hover:bg-muted/50"
                                )}
                            >
                                <CheckCircle2 className={cn("h-6 w-6 mb-2", currentStatus === 'completed' ? "text-blue-600" : "text-muted-foreground")} />
                                <span className="font-medium text-sm">{t.goals.filterCompleted}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusUpdate('abandoned')}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                    currentStatus === 'abandoned'
                                        ? "border-slate-500 bg-slate-50 dark:bg-slate-950/30 shadow-sm"
                                        : "border-border hover:border-border/80 hover:bg-muted/50"
                                )}
                            >
                                <XCircle className={cn("h-6 w-6 mb-2", currentStatus === 'abandoned' ? "text-slate-600" : "text-muted-foreground")} />
                                <span className="font-medium text-sm">{t.goals.filterAbandoned}</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 p-5 bg-muted/50 rounded-xl border border-border">
                        <div className="space-y-1">
                            <Label className="text-base font-semibold text-foreground">{t.editGoal.goalTimeline}</Label>
                            <p className="text-sm text-muted-foreground">{t.editGoal.chooseDates}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Date Picker */}
                            <div className="space-y-2.5">
                                <Label htmlFor="edit-start-date" className="text-sm font-semibold text-foreground">{t.editGoal.startDate}</Label>
                                <Input
                                    id="edit-start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        const newStartDate = e.target.value;
                                        setStartDate(newStartDate);
                                        // Adjust end date if it's before new start date
                                        if (endDate < newStartDate) {
                                            const start = new Date(newStartDate);
                                            start.setDate(start.getDate() + 1);
                                            setEndDate(start.toISOString().split('T')[0]);
                                        }
                                    }}
                                    className="h-11"
                                    required
                                />
                            </div>

                            {/* End Date Picker */}
                            <div className="space-y-2.5">
                                <Label htmlFor="edit-end-date" className="text-sm font-semibold text-foreground">{t.editGoal.endDate}</Label>
                                <Input
                                    id="edit-end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    className="h-11"
                                    required
                                />
                            </div>
                        </div>

                        {/* Duration Display */}
                        {startDate && endDate && (
                            <div className="mt-3 p-3 bg-background rounded-lg border border-border">
                                <p className="text-sm text-muted-foreground">
                                    {t.editGoal.duration}: <span className="font-semibold text-foreground">
                                        {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} {t.editGoal.days}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 p-5 bg-muted/50 rounded-xl border border-border">
                        <div className="space-y-1">
                            <Label className="text-base font-semibold text-foreground">{t.goal.intensity}</Label>
                            <p className="text-sm text-muted-foreground">{t.goal.intensityHelp}</p>
                        </div>
                        <RadioGroup
                            value={intensity}
                            onValueChange={(value) => setIntensity(value as 'low' | 'medium' | 'high')}
                            className="space-y-3"
                        >
                            <label 
                                htmlFor="edit-intensity-low"
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'low'
                                    ? 'border-green-500 bg-green-500/10 shadow-sm'
                                    : 'border-border hover:border-border/80 hover:bg-muted/50'
                                }`}
                            >
                                <RadioGroupItem value="low" id="edit-intensity-low" />
                                <TrendingDown className={cn("h-5 w-5", intensity === 'low' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground')} />
                                <span className="font-medium cursor-pointer flex-1">
                                    <span className="block text-base mb-1">{t.goal.intensityLow}</span>
                                    <span className="text-sm text-muted-foreground font-normal">{t.goal.intensityLowDesc}</span>
                                </span>
                            </label>
                            <label 
                                htmlFor="edit-intensity-medium"
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'medium'
                                    ? 'border-yellow-500 bg-yellow-500/10 shadow-sm'
                                    : 'border-border hover:border-border/80 hover:bg-muted/50'
                                }`}
                            >
                                <RadioGroupItem value="medium" id="edit-intensity-medium" />
                                <TrendingUp className={cn("h-5 w-5", intensity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground')} />
                                <span className="font-medium cursor-pointer flex-1">
                                    <span className="block text-base mb-1">{t.goal.intensityMedium}</span>
                                    <span className="text-sm text-muted-foreground font-normal">{t.goal.intensityMediumDesc}</span>
                                </span>
                            </label>
                            <label 
                                htmlFor="edit-intensity-high"
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'high'
                                    ? 'border-red-500 bg-red-500/10 shadow-sm'
                                    : 'border-border hover:border-border/80 hover:bg-muted/50'
                                }`}
                            >
                                <RadioGroupItem value="high" id="edit-intensity-high" />
                                <Flame className={cn("h-5 w-5", intensity === 'high' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground')} />
                                <span className="font-medium cursor-pointer flex-1">
                                    <span className="block text-base mb-1">{t.goal.intensityHigh}</span>
                                    <span className="text-sm text-muted-foreground font-normal">{t.goal.intensityHighDesc}</span>
                                </span>
                            </label>
                        </RadioGroup>
                    </div>

                    {state?.error && (
                        <div className="text-red-700 text-sm bg-red-50 p-4 rounded-lg border-2 border-red-200 font-medium">
                            {state.error}
                        </div>
                    )}

                    <div className="sticky bottom-0 bg-background border-t border-border pt-4 -mx-6 px-6 -mb-6 pb-6 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <a href="/app/goals">{t.editGoal.cancel}</a>
                        </Button>
                        <Button type="submit" disabled={isPending} size="lg" className="flex-1">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t.editGoal.updatingGoal}
                                </>
                            ) : (
                                t.editGoal.updateGoal
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
