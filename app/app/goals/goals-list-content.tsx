'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Target, Calendar, Zap, AlertTriangle, MoreVertical, CheckCircle2, XCircle, Ban } from 'lucide-react';
import Link from 'next/link';
import { deleteGoalAction } from '@/app/app/goal/actions';
import { updateGoalStatusAction } from '@/app/app/goals/[id]/actions';
import { useActionState, useState, useOptimistic, useTransition } from 'react';
import type { Goal } from '@/lib/supabase/queries';
import { useTranslation } from '@/contexts/translation-context';

type GoalsListContentProps = {
  goals: Goal[];
};

export function GoalsListContent({ goals: initialGoals }: GoalsListContentProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'abandoned'>('all');
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(
    deleteGoalAction,
    null
  );
  const [optimisticGoals, setOptimisticGoals] = useOptimistic<Goal[]>(initialGoals);
  const [isPending, startTransition] = useTransition();
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{show: boolean; goalId: string; goalTitle: string}>({
    show: false,
    goalId: '',
    goalTitle: ''
  });
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
  const [updatingStatusGoalId, setUpdatingStatusGoalId] = useState<string | null>(null);

  const handleDeleteClick = (goalId: string, goalTitle: string) => {
    setShowConfirmDialog({ show: true, goalId, goalTitle });
  };

  const handleConfirmDelete = async () => {
    const goalId = showConfirmDialog.goalId;
    setShowConfirmDialog({ show: false, goalId: '', goalTitle: '' });
    setDeletingGoalId(goalId);

    // Optimistic update
    startTransition(() => {
      setOptimisticGoals(optimisticGoals.filter(g => g.id !== goalId));
    });

    // Execute the actual delete action
    const formData = new FormData();
    formData.append('goalId', goalId);
    await deleteFormAction(formData);
    setDeletingGoalId(null);
  };

  const handleStatusUpdate = async (goalId: string, newStatus: 'active' | 'completed' | 'abandoned') => {
    setUpdatingStatusGoalId(goalId);
    setShowStatusMenu(null);

    // Optimistic update
    startTransition(() => {
      setOptimisticGoals(optimisticGoals.map(g => 
        g.id === goalId ? { ...g, status: newStatus } : g
      ));
    });

    // Execute the actual update
    await updateGoalStatusAction(goalId, newStatus);
    setUpdatingStatusGoalId(null);
  };

  const filteredGoals =
    filter === 'all'
      ? optimisticGoals
      : optimisticGoals.filter((goal) => goal.status === filter);

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
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{t.goals?.title || 'Goals'}</h1>
            <p className="text-muted-foreground text-lg">{t.goals?.manageAll || 'Manage all your goals'}</p>
          </div>
          <Button asChild size="lg">
            <Link href="/app/goal">
              <Plus className="mr-2 h-4 w-4" />
              {t.goals?.createGoal || 'Create Goal'}
            </Link>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {(['all', 'active', 'completed', 'abandoned'] as const).map((status) => {
            const labels = {
              all: t.goals?.filterAll || 'All',
              active: t.goals?.filterActive || 'Active',
              completed: t.goals?.filterCompleted || 'Completed',
              abandoned: t.goals?.filterAbandoned || 'Abandoned'
            };
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {labels[status]}
                {status !== 'all' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({initialGoals.filter((g) => g.status === status).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t.goals?.noGoalsFound || 'No goals found'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {filter === 'all'
                    ? (t.goals?.noGoalsYet || "You haven't created any goals yet.")
                    : (t.goals?.noFilteredGoals?.replace('{filter}', t.goals?.status?.[filter] || filter) || `You don't have any ${filter} goals.`)}
                </p>
                {filter === 'all' && (
                  <Button asChild>
                    <Link href="/app/goal">{t.goals?.createFirstGoal || 'Create Your First Goal'}</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => {
              const progress = calculateProgress(goal);
              // Round to 2 decimal places to prevent hydration mismatch
              const progressRounded = Math.round(progress * 100) / 100;
              return (
                <Card
                  key={goal.id}
                  className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2 flex-1">
                        {goal.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <button
                            onClick={() => setShowStatusMenu(showStatusMenu === goal.id ? null : goal.id)}
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(goal.status)} hover:opacity-80 transition-opacity cursor-pointer`}
                            disabled={updatingStatusGoalId === goal.id}
                          >
                            {updatingStatusGoalId === goal.id ? (t.nav?.loading || 'Updating...') : (t.goals?.status?.[goal.status as keyof typeof t.goals.status] || goal.status)}
                          </button>
                          {showStatusMenu === goal.id && (
                            <div className="absolute right-0 top-full mt-2 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
                              <button
                                onClick={() => handleStatusUpdate(goal.id, 'active')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                disabled={goal.status === 'active'}
                              >
                                <Zap className="h-4 w-4 text-emerald-600" />
                                <span className={goal.status === 'active' ? 'font-semibold' : ''}>{t.goals?.filterActive || 'Active'}</span>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(goal.id, 'completed')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                disabled={goal.status === 'completed'}
                              >
                                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                <span className={goal.status === 'completed' ? 'font-semibold' : ''}>{t.goals?.filterCompleted || 'Completed'}</span>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(goal.id, 'abandoned')}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                disabled={goal.status === 'abandoned'}
                              >
                                <XCircle className="h-4 w-4 text-slate-600" />
                                <span className={goal.status === 'abandoned' ? 'font-semibold' : ''}>{t.goals?.filterAbandoned || 'Abandoned'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(goal.start_date).toLocaleDateString()} -{' '}
                            {new Date(goal.end_date).toLocaleDateString()}
                          </span>
                        </div>

                        {goal.status === 'active' && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{t.goals?.progress || 'Progress'}</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                                style={{ width: `${progressRounded}%` }}
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
                            {t.goals?.edit || 'Edit'}
                          </Link>
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(goal.id, goal.title)}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
                          disabled={deletingGoalId === goal.id || isPending}
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          {deletingGoalId === goal.id ? (t.nav?.loading || 'Deleting...') : (t.goals?.delete || 'Delete')}
                        </Button>
                      </div>

                      {deleteState?.error && deletingGoalId === goal.id && (
                        <div className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-950/50 p-2 rounded border border-red-200 dark:border-red-900">
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

        {/* Confirmation Dialog */}
        {showConfirmDialog.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full border-2 border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle>{t.goals?.delete || 'Delete'} {t.goal?.title || 'Goal'}?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Are you sure you want to delete <strong className="text-foreground">{showConfirmDialog.goalTitle}</strong>? This action cannot be undone. All associated tasks and progress will be permanently deleted.
                </p>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setShowConfirmDialog({ show: false, goalId: '', goalTitle: '' })}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {t.goals?.delete || 'Delete'} {t.goal?.title || 'Goal'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

