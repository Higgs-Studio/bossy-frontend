'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createGoalAction } from './actions';
import { Loader2, Target } from 'lucide-react';
import { BOSS_PERSONALITIES } from '@/lib/boss/reactions';

export function GoalForm() {
  const [state, formAction, isPending] = useActionState(createGoalAction, null);

  return (
    <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Goal Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
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
            <p className="text-sm text-gray-600 mt-2">
              Be specific and concrete. This goal cannot be edited once created.
            </p>
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Label className="text-base font-semibold">Time Horizon</Label>
            <p className="text-sm text-gray-600 -mt-2">How long will you commit to this goal?</p>
            <RadioGroup
              name="timeHorizon"
              defaultValue="30"
              className="mt-3 space-y-3"
              required
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-primary/30 hover:bg-white transition-all cursor-pointer">
                <RadioGroupItem value="14" id="14" />
                <Label htmlFor="14" className="font-medium cursor-pointer flex-1">
                  14 days
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer">
                <RadioGroupItem value="30" id="30" />
                <Label htmlFor="30" className="font-medium cursor-pointer flex-1">
                  30 days
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-primary/30 hover:bg-white transition-all cursor-pointer">
                <RadioGroupItem value="60" id="60" />
                <Label htmlFor="60" className="font-medium cursor-pointer flex-1">
                  60 days
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Label className="text-base font-semibold">Intensity</Label>
            <p className="text-sm text-gray-600 -mt-2">How much daily commitment are you making?</p>
            <RadioGroup
              name="intensity"
              defaultValue="medium"
              className="mt-3 space-y-3"
              required
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-primary/30 hover:bg-white transition-all cursor-pointer">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-medium cursor-pointer flex-1">
                  <span className="block">Low</span>
                  <span className="text-sm text-gray-600 font-normal">Light daily commitment</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-medium cursor-pointer flex-1">
                  <span className="block">Medium</span>
                  <span className="text-sm text-gray-600 font-normal">Moderate daily commitment</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-primary/30 hover:bg-white transition-all cursor-pointer">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-medium cursor-pointer flex-1">
                  <span className="block">High</span>
                  <span className="text-sm text-gray-600 font-normal">Significant daily commitment</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Label className="text-base font-semibold">Choose Your AI Boss</Label>
            <p className="text-sm text-gray-600 -mt-2">Select the accountability style that motivates you</p>
            <RadioGroup
              name="bossType"
              defaultValue="execution"
              className="mt-3 space-y-3"
              required
            >
              {Object.values(BOSS_PERSONALITIES).map((boss) => (
                <div key={boss.id} className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-primary/30 hover:bg-white transition-all cursor-pointer">
                  <RadioGroupItem value={boss.id} id={boss.id} className="mt-1" />
                  <Label htmlFor={boss.id} className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{boss.avatar}</span>
                      <span className="font-semibold text-base">{boss.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{boss.description}</p>
                  </Label>
                </div>
              ))}
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
            <p className="text-sm text-gray-600 mt-2">
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

