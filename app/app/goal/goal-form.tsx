'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createGoalAction } from './actions';
import { Loader2, Target } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useTranslation } from '@/contexts/translation-context';

export function GoalForm() {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(createGoalAction, null);
  const [intensity, setIntensity] = useState('medium');
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 30), 'yyyy-MM-dd'));

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {t.goal.goalDetails}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          {/* Hidden inputs to sync form values */}
          <input type="hidden" name="intensity" value={intensity} />
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">{t.goal.title}</Label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder={t.goal.titlePlaceholder}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {t.goal.titleHelp}
            </p>
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border">
            <Label className="text-base font-semibold">{t.goal.timeHorizon}</Label>
            <p className="text-sm text-muted-foreground -mt-2">{t.goal.timeHorizonHelp}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {/* Start Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-sm font-medium">{t.goal.startDate}</Label>
                <Input
                  id="start-date"
                  name="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    setStartDate(newStartDate);
                    if (endDate < newStartDate) {
                      const start = new Date(newStartDate);
                      start.setDate(start.getDate() + 1);
                      setEndDate(format(start, 'yyyy-MM-dd'));
                    }
                  }}
                  className="h-11"
                  required
                />
              </div>

              {/* End Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-sm font-medium">{t.editGoal.endDate}</Label>
                <Input
                  id="end-date"
                  name="endDate"
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

          <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border">
            <Label className="text-base font-semibold">{t.goal.intensity}</Label>
            <p className="text-sm text-muted-foreground -mt-2">{t.goal.intensityHelp}</p>
            <RadioGroup
              value={intensity}
              onValueChange={setIntensity}
              className="mt-3 space-y-3"
            >
              <label 
                htmlFor="intensity-low"
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'low'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'border-border hover:border-border/80 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="low" id="intensity-low" />
                <span className="font-medium cursor-pointer flex-1">
                  <span className="block">{t.goal.intensityLow}</span>
                  <span className="text-sm text-muted-foreground font-normal">{t.goal.intensityLowDesc}</span>
                </span>
              </label>
              <label 
                htmlFor="intensity-medium"
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'medium'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'border-border hover:border-border/80 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="medium" id="intensity-medium" />
                <span className="font-medium cursor-pointer flex-1">
                  <span className="block">{t.goal.intensityMedium}</span>
                  <span className="text-sm text-muted-foreground font-normal">{t.goal.intensityMediumDesc}</span>
                </span>
              </label>
              <label 
                htmlFor="intensity-high"
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${intensity === 'high'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'border-border hover:border-border/80 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="high" id="intensity-high" />
                <span className="font-medium cursor-pointer flex-1">
                  <span className="block">{t.goal.intensityHigh}</span>
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

          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.goal.creating}
              </>
            ) : (
              t.goal.create
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
