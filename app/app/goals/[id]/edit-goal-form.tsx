'use client';

import { useActionState, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { updateGoalAction } from '@/app/app/goal/actions';
import { updateGoalStatusAction } from './actions';
import { Loader2, Target, Calendar as CalendarIcon, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { format, addDays } from 'date-fns';
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

    // Controlled state
    const [intensity, setIntensity] = useState(goal.intensity);
    const [startDate, setStartDate] = useState<Date>(new Date(goal.start_date));
    const [endDate, setEndDate] = useState<Date>(new Date(goal.end_date));
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(goal.status);
    const [isUpdatingStatus, startTransition] = useTransition();

    const handleStatusUpdate = async (newStatus: 'active' | 'completed' | 'abandoned') => {
        startTransition(async () => {
            setCurrentStatus(newStatus);
            await updateGoalStatusAction(goal.id, newStatus);
        });
    };

    return (
        <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
            <CardHeader className="border-b border-border pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <Target className="h-5 w-5 text-primary" />
                    {t.editGoal?.editDetails || 'Edit Goal Details'}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={formAction} className="space-y-8">
                    <input type="hidden" name="goalId" value={goal.id} />
                    {/* Hidden inputs to sync form values */}
                    <input type="hidden" name="intensity" value={intensity} />
                    <input type="hidden" name="startDate" value={startDate.toISOString().split('T')[0]} />
                    <input type="hidden" name="endDate" value={endDate.toISOString().split('T')[0]} />

                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-base font-semibold text-foreground">{t.goal?.title || 'Goal Title'}</Label>
                        <Input
                            id="title"
                            name="title"
                            type="text"
                            required
                            maxLength={200}
                            placeholder={t.goal?.titlePlaceholder || 'e.g., Build a SaaS product'}
                            defaultValue={goal.title}
                            className="h-11 text-base"
                        />
                    </div>

                    <div className="space-y-4 p-5 bg-muted/50 rounded-xl border border-border">
                        <div className="space-y-1">
                            <Label className="text-base font-semibold text-foreground">{t.editGoal?.goalStatus || 'Goal Status'}</Label>
                            <p className="text-sm text-muted-foreground">{t.editGoal?.updateStatus || 'Update the current status of your goal'}</p>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => handleStatusUpdate('active')}
                                disabled={isUpdatingStatus || currentStatus === 'active'}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                    currentStatus === 'active'
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-sm"
                                        : "border-border hover:border-border/80 hover:bg-muted/50"
                                )}
                            >
                                <Zap className={cn("h-6 w-6 mb-2", currentStatus === 'active' ? "text-emerald-600" : "text-muted-foreground")} />
                                <span className="font-medium text-sm">{t.goals?.status?.active || 'Active'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusUpdate('completed')}
                                disabled={isUpdatingStatus || currentStatus === 'completed'}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                    currentStatus === 'completed'
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm"
                                        : "border-border hover:border-border/80 hover:bg-muted/50"
                                )}
                            >
                                <CheckCircle2 className={cn("h-6 w-6 mb-2", currentStatus === 'completed' ? "text-blue-600" : "text-muted-foreground")} />
                                <span className="font-medium text-sm">{t.goals?.status?.completed || 'Completed'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusUpdate('abandoned')}
                                disabled={isUpdatingStatus || currentStatus === 'abandoned'}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                                    currentStatus === 'abandoned'
                                        ? "border-slate-500 bg-slate-50 dark:bg-slate-950/30 shadow-sm"
                                        : "border-border hover:border-border/80 hover:bg-muted/50"
                                )}
                            >
                                <XCircle className={cn("h-6 w-6 mb-2", currentStatus === 'abandoned' ? "text-slate-600" : "text-muted-foreground")} />
                                <span className="font-medium text-sm">{t.goals?.status?.abandoned || 'Abandoned'}</span>
                            </button>
                        </div>
                        {isUpdatingStatus && (
                            <p className="text-sm text-muted-foreground text-center">{t.editGoal?.updatingStatus || 'Updating status...'}</p>
                        )}
                    </div>

                    <div className="space-y-4 p-5 bg-muted/50 rounded-xl border border-border">
                        <div className="space-y-1">
                            <Label className="text-base font-semibold text-foreground">{t.editGoal?.goalTimeline || 'Goal Timeline'}</Label>
                            <p className="text-sm text-muted-foreground">{t.editGoal?.chooseDates || 'Choose your start and end dates'}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Date Picker */}
                            <div className="space-y-2.5">
                                <Label htmlFor="edit-start-date-btn" className="text-sm font-semibold text-foreground">{t.editGoal?.startDate || 'Start Date'}</Label>
                                <Button
                                    id="edit-start-date-btn"
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                    onClick={() => {
                                        setShowStartCalendar(!showStartCalendar);
                                        setShowEndCalendar(false);
                                    }}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, 'PPP') : <span>{t.editGoal?.pickDate || 'Pick a date'}</span>}
                                </Button>
                                {showStartCalendar && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setShowStartCalendar(false)}
                                        />
                                        <div className="relative">
                                            <div className="absolute z-50 bg-popover border border-border rounded-lg shadow-lg p-3 mt-1 left-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setStartDate(date);
                                                            // Adjust end date if it's before new start date
                                                            if (endDate < date) {
                                                                setEndDate(addDays(date, 30));
                                                            }
                                                        }
                                                        setShowStartCalendar(false);
                                                    }}
                                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                    initialFocus
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* End Date Picker */}
                            <div className="space-y-2.5">
                                <Label htmlFor="edit-end-date-btn" className="text-sm font-semibold text-foreground">{t.editGoal?.endDate || 'End Date'}</Label>
                                <Button
                                    id="edit-end-date-btn"
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                    onClick={() => {
                                        setShowEndCalendar(!showEndCalendar);
                                        setShowStartCalendar(false);
                                    }}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, 'PPP') : <span>{t.editGoal?.pickDate || 'Pick a date'}</span>}
                                </Button>
                                {showEndCalendar && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setShowEndCalendar(false)}
                                        />
                                        <div className="relative">
                                            <div className="absolute z-50 bg-popover border border-border rounded-lg shadow-lg p-3 mt-1 left-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setEndDate(date);
                                                        }
                                                        setShowEndCalendar(false);
                                                    }}
                                                    disabled={(date) => date <= startDate}
                                                    initialFocus
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Duration Display */}
                        {startDate && endDate && (
                            <div className="mt-3 p-3 bg-background rounded-lg border border-border">
                                <p className="text-sm text-muted-foreground">
                                    {t.editGoal?.duration || 'Duration'}: <span className="font-semibold text-foreground">
                                        {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} {t.editGoal?.days || 'days'}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 p-5 bg-muted/50 rounded-xl border border-border">
                        <div className="space-y-1">
                            <Label className="text-base font-semibold text-foreground">{t.goal?.intensity || 'Intensity'}</Label>
                            <p className="text-sm text-muted-foreground">{t.goal?.intensityHelp || 'How much daily commitment are you making?'}</p>
                        </div>
                        <RadioGroup
                            value={intensity}
                            onValueChange={(value) => setIntensity(value as 'low' | 'medium' | 'high')}
                            className="space-y-3"
                        >
                            <label 
                                htmlFor="edit-intensity-low"
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'low'
                                    ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                                    : 'border-border hover:border-border/80 hover:bg-muted/50'
                                }`}
                            >
                                <RadioGroupItem value="low" id="edit-intensity-low" />
                                <span className="font-medium cursor-pointer flex-1">
                                    <span className="block text-base mb-1">{t.goal?.intensityLow || 'Low'}</span>
                                    <span className="text-sm text-muted-foreground font-normal">{t.goal?.intensityLowDesc || 'Light daily commitment'}</span>
                                </span>
                            </label>
                            <label 
                                htmlFor="edit-intensity-medium"
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'medium'
                                    ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                                    : 'border-border hover:border-border/80 hover:bg-muted/50'
                                }`}
                            >
                                <RadioGroupItem value="medium" id="edit-intensity-medium" />
                                <span className="font-medium cursor-pointer flex-1">
                                    <span className="block text-base mb-1">{t.goal?.intensityMedium || 'Medium'}</span>
                                    <span className="text-sm text-muted-foreground font-normal">{t.goal?.intensityMediumDesc || 'Moderate daily commitment'}</span>
                                </span>
                            </label>
                            <label 
                                htmlFor="edit-intensity-high"
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'high'
                                    ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                                    : 'border-border hover:border-border/80 hover:bg-muted/50'
                                }`}
                            >
                                <RadioGroupItem value="high" id="edit-intensity-high" />
                                <span className="font-medium cursor-pointer flex-1">
                                    <span className="block text-base mb-1">{t.goal?.intensityHigh || 'High'}</span>
                                    <span className="text-sm text-muted-foreground font-normal">{t.goal?.intensityHighDesc || 'Significant daily commitment'}</span>
                                </span>
                            </label>
                        </RadioGroup>
                    </div>

                    {state?.error && (
                        <div className="text-red-700 text-sm bg-red-50 p-4 rounded-lg border-2 border-red-200 font-medium">
                            {state.error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="flex-1"
                        >
                            <a href="/app/goals">{t.editGoal?.cancel || 'Cancel'}</a>
                        </Button>
                        <Button type="submit" disabled={isPending} className="flex-1" size="lg">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t.editGoal?.updatingGoal || 'Updating Goal...'}
                                </>
                            ) : (
                                t.editGoal?.updateGoal || 'Update Goal'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
