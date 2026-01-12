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
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/translation-context';

export function GoalForm() {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(createGoalAction, null);
  const [intensity, setIntensity] = useState('medium');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 30));
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {t.goal?.goalDetails || 'Goal Details'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          {/* Hidden inputs to sync form values */}
          <input type="hidden" name="intensity" value={intensity} />
          <input type="hidden" name="startDate" value={startDate.toISOString().split('T')[0]} />
          <input type="hidden" name="endDate" value={endDate.toISOString().split('T')[0]} />
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">{t.goal?.title || 'Goal Title'}</Label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder={t.goal?.titlePlaceholder || 'e.g., Build a SaaS product'}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {t.goal?.titleHelp || 'Be specific and concrete. This goal cannot be edited once created.'}
            </p>
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border">
            <Label className="text-base font-semibold">{t.goal?.timeHorizon || 'Goal Timeline'}</Label>
            <p className="text-sm text-muted-foreground -mt-2">{t.goal?.timeHorizonHelp || 'Choose your start and end dates'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {/* Start Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="start-date-btn" className="text-sm font-medium">{t.goal?.startDate || 'Start Date'}</Label>
                <Button
                  id="start-date-btn"
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
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
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
              <div className="space-y-2">
                <Label htmlFor="end-date-btn" className="text-sm font-medium">{t.dashboard?.ends || 'End Date'}</Label>
                <Button
                  id="end-date-btn"
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
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
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
                  Duration: <span className="font-semibold text-foreground">
                    {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-xl border border-border">
            <Label className="text-base font-semibold">{t.goal?.intensity || 'Intensity'}</Label>
            <p className="text-sm text-muted-foreground -mt-2">{t.goal?.intensityHelp || 'How much daily commitment are you making?'}</p>
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
                  <span className="block">{t.goal?.intensityLow || 'Low'}</span>
                  <span className="text-sm text-muted-foreground font-normal">{t.goal?.intensityLowDesc || 'Light daily commitment'}</span>
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
                  <span className="block">{t.goal?.intensityMedium || 'Medium'}</span>
                  <span className="text-sm text-muted-foreground font-normal">{t.goal?.intensityMediumDesc || 'Moderate daily commitment'}</span>
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
                  <span className="block">{t.goal?.intensityHigh || 'High'}</span>
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

          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.goal?.creating || 'Creating Goal...'}
              </>
            ) : (
              t.goal?.create || 'Create Goal'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
