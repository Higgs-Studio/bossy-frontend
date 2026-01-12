'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { createGoalAction } from './actions';
import { Loader2, Target, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export function GoalForm() {
  const [state, formAction, isPending] = useActionState(createGoalAction, null);
  const [intensity, setIntensity] = useState('medium');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Goal Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          {/* Hidden inputs to sync RadioGroup values with form */}
          <input type="hidden" name="timeHorizon" value={timeHorizon} />
          <input type="hidden" name="intensity" value={intensity} />
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">Goal Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="e.g., Build a SaaS product"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Be specific and concrete. This goal cannot be edited once created.
            </p>
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border">
            <Label className="text-base font-semibold">Time Horizon</Label>
            <p className="text-sm text-muted-foreground -mt-2">How long will you commit to this goal?</p>
            <RadioGroup
              value={timeHorizon}
              onValueChange={setTimeHorizon}
              className="mt-3 space-y-3"
            >
              <label 
                htmlFor="time-14"
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${timeHorizon === '14'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'border-border hover:border-border/80 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="14" id="time-14" />
                <span className="font-medium flex-1">14 days</span>
              </label>
              <label 
                htmlFor="time-30"
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${timeHorizon === '30'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'border-border hover:border-border/80 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="30" id="time-30" />
                <span className="font-medium flex-1">30 days</span>
              </label>
              <label 
                htmlFor="time-60"
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${timeHorizon === '60'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                  : 'border-border hover:border-border/80 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="60" id="time-60" />
                <span className="font-medium flex-1">60 days</span>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border">
            <Label className="text-base font-semibold">Intensity</Label>
            <p className="text-sm text-muted-foreground -mt-2">How much daily commitment are you making?</p>
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
                  <span className="block">Low</span>
                  <span className="text-sm text-muted-foreground font-normal">Light daily commitment</span>
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
                  <span className="block">Medium</span>
                  <span className="text-sm text-muted-foreground font-normal">Moderate daily commitment</span>
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
                  <span className="block">High</span>
                  <span className="text-sm text-muted-foreground font-normal">Significant daily commitment</span>
                </span>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-base font-semibold">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Choose when you want to start your accountability journey.
            </p>
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
                Creating Goal...
              </>
            ) : (
              'Create Goal'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
