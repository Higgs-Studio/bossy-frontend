'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Target, Calendar, Zap } from 'lucide-react';
import Link from 'next/link';
import { deleteGoalAction } from '@/app/app/goal/actions';
import { useActionState, useState } from 'react';
import type { Goal } from '@/lib/supabase/queries';

type GoalsListContentProps = {
  goals: Goal[];
};

export function GoalsListContent({ goals }: GoalsListContentProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'abandoned'>('all');
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteGoalAction,
    null
  );

  const filteredGoals =
    filter === 'all'
      ? goals
      : goals.filter((goal) => goal.status === filter);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      abandoned: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return variants[status] || variants.abandoned;
  };

  const getIntensityBadge = (intensity: string) => {
    const variants: Record<string, string> = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return variants[intensity] || variants.low;
  };

  const calculateProgress = (goal: Goal) => {
    const start = new Date(goal.start_date).getTime();
    const end = new Date(goal.end_date).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Goals</h1>
            <p className="text-slate-600 text-lg">Manage all your goals</p>
          </div>
          <Button asChild size="lg">
            <Link href="/app/goal">
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {(['all', 'active', 'completed', 'abandoned'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-xs opacity-75">
                  ({goals.filter((g) => g.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <Card className="border border-slate-200">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No goals found
                </h3>
                <p className="text-slate-600 mb-6">
                  {filter === 'all'
                    ? "You haven't created any goals yet."
                    : `You don't have any ${filter} goals.`}
                </p>
                {filter === 'all' && (
                  <Button asChild>
                    <Link href="/app/goal">Create Your First Goal</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => {
              const progress = calculateProgress(goal);
              return (
                <Card
                  key={goal.id}
                  className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2 flex-1">
                        {goal.title}
                      </CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center w-fit ${getIntensityBadge(goal.intensity)}`}>
                          <Zap className="mr-1 h-3 w-3" />
                          {goal.intensity}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(goal.start_date).toLocaleDateString()} -{' '}
                            {new Date(goal.end_date).toLocaleDateString()}
                          </span>
                        </div>

                        {goal.status === 'active' && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-600">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Link href={`/app/goals/${goal.id}`}>
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </Link>
                        </Button>
                        <form action={deleteFormAction} className="flex-1">
                          <input type="hidden" name="goalId" value={goal.id} />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isDeletePending}
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </Button>
                        </form>
                      </div>

                      {deleteState?.error && (
                        <div className="text-red-600 text-xs bg-red-50 p-2 rounded border border-red-200">
                          {deleteState.error}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

