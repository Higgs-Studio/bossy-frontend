'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Target, Calendar, Zap, AlertTriangle, MoreVertical, CheckCircle2, XCircle, Ban, Pencil, Flame, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { deleteGoalAction } from '@/app/app/goal/actions';
import { updateGoalStatusAction, updateGoalIntensityAction } from '@/app/app/goals/[id]/actions';
import { useActionState, useState, useOptimistic, useTransition } from 'react';
import type { Goal } from '@/lib/supabase/queries';
import { useTranslation } from '@/contexts/translation-context';
import { useRouter } from 'next/navigation';

type GoalsListContentProps = {
  goals: Goal[];
};

export function GoalsListContent({ goals: initialGoals }: GoalsListContentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'abandoned'>('active');
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
  const [showIntensityMenu, setShowIntensityMenu] = useState<string | null>(null);
  const [updatingIntensityGoalId, setUpdatingIntensityGoalId] = useState<string | null>(null);

  const handleCardClick = (goalId: string) => {
    router.push(`/app/goals/${goalId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, goalId: string, goalTitle: string) => {
    e.stopPropagation(); // Prevent card click
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

  const handleIntensityUpdate = async (goalId: string, newIntensity: 'low' | 'medium' | 'high') => {
    setUpdatingIntensityGoalId(goalId);
    setShowIntensityMenu(null);

    // Optimistic update
    startTransition(() => {
      setOptimisticGoals(optimisticGoals.map(g => 
        g.id === goalId ? { ...g, intensity: newIntensity } : g
      ));
    });

    // Execute the actual update
    await updateGoalIntensityAction(goalId, newIntensity);
    setUpdatingIntensityGoalId(null);
  };

  const filteredGoals =
    filter === 'all'
      ? optimisticGoals
      : optimisticGoals.filter((goal) => goal.status === filter);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
      completed: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
      abandoned: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-700',
    };
    return variants[status] || variants.abandoned;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactElement> = {
      active: <Zap className="h-3 w-3" />,
      completed: <CheckCircle2 className="h-3 w-3" />,
      abandoned: <XCircle className="h-3 w-3" />,
    };
    return icons[status] || icons.abandoned;
  };

  const getStatusCardStyle = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-gradient-to-br from-emerald-50/50 to-background dark:from-emerald-950/10 dark:to-background border-emerald-200 dark:border-emerald-900',
      completed: 'bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/10 dark:to-background border-blue-200 dark:border-blue-900',
      abandoned: 'bg-gradient-to-br from-slate-50/50 to-background dark:from-slate-950/10 dark:to-background border-slate-200 dark:border-slate-800',
    };
    return styles[status] || styles.abandoned;
  };

  const getIntensityBadge = (intensity: string) => {
    const variants: Record<string, string> = {
      high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800',
      low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
    };
    return variants[intensity] || variants.low;
  };

  const getIntensityIcon = (intensity: string) => {
    const icons: Record<string, React.ReactElement> = {
      high: <Flame className="h-3 w-3" />,
      medium: <TrendingUp className="h-3 w-3" />,
      low: <TrendingDown className="h-3 w-3" />,
    };
    return icons[intensity] || icons.low;
  };

  const calculateProgress = (goal: Goal) => {
    // Calculate based on task completion
    if (goal.total_tasks && goal.total_tasks > 0) {
      return Math.round(((goal.completed_tasks || 0) / goal.total_tasks) * 100);
    }
    return 0;
  };

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const formatDaysLeft = (daysLeft: number) => {
    if (daysLeft < 0) {
      return `${Math.abs(daysLeft)} days overdue`;
    } else if (daysLeft === 0) {
      return 'Due today';
    } else if (daysLeft === 1) {
      return '1 day left';
    } else {
      return `${daysLeft} days left`;
    }
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
              return (
                <Card
                  key={goal.id}
                  className={`border hover:shadow-xl transition-all duration-200 cursor-pointer relative group ${getStatusCardStyle(goal.status)}`}
                  onClick={() => handleCardClick(goal.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2 flex-1 pr-16">
                        {goal.title}
                      </CardTitle>
                      {/* Action buttons - top right corner */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(goal.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                          title={t.goals?.edit || 'Edit'}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, goal.id, goal.title)}
                          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          disabled={deletingGoalId === goal.id || isPending}
                          title={t.goals?.delete || 'Delete'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {/* Badges row - compact inline badges */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {/* Status badge */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowStatusMenu(showStatusMenu === goal.id ? null : goal.id);
                          }}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(goal.status)} hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1`}
                          disabled={updatingStatusGoalId === goal.id}
                        >
                          {getStatusIcon(goal.status)}
                          <span>{updatingStatusGoalId === goal.id ? (t.nav?.loading || '...') : (t.goals?.status?.[goal.status as keyof typeof t.goals.status] || goal.status)}</span>
                        </button>
                        {showStatusMenu === goal.id && (
                          <div className="absolute left-0 top-full mt-2 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(goal.id, 'active');
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                              disabled={goal.status === 'active'}
                            >
                              <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span className={goal.status === 'active' ? 'font-semibold' : ''}>{t.goals?.filterActive || 'Active'}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(goal.id, 'completed');
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                              disabled={goal.status === 'completed'}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              <span className={goal.status === 'completed' ? 'font-semibold' : ''}>{t.goals?.filterCompleted || 'Completed'}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(goal.id, 'abandoned');
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                              disabled={goal.status === 'abandoned'}
                            >
                              <XCircle className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                              <span className={goal.status === 'abandoned' ? 'font-semibold' : ''}>{t.goals?.filterAbandoned || 'Abandoned'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Intensity badge */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowIntensityMenu(showIntensityMenu === goal.id ? null : goal.id);
                          }}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getIntensityBadge(goal.intensity)} hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1`}
                          disabled={updatingIntensityGoalId === goal.id}
                        >
                          {getIntensityIcon(goal.intensity)}
                          <span className="capitalize">{updatingIntensityGoalId === goal.id ? (t.nav?.loading || '...') : goal.intensity}</span>
                        </button>
                        {showIntensityMenu === goal.id && (
                          <div className="absolute left-0 top-full mt-2 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIntensityUpdate(goal.id, 'high');
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                              disabled={goal.intensity === 'high'}
                            >
                              <Flame className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                              <span className={goal.intensity === 'high' ? 'font-semibold' : ''}>High</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIntensityUpdate(goal.id, 'medium');
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                              disabled={goal.intensity === 'medium'}
                            >
                              <TrendingUp className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                              <span className={goal.intensity === 'medium' ? 'font-semibold' : ''}>Medium</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIntensityUpdate(goal.id, 'low');
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                              disabled={goal.intensity === 'low'}
                            >
                              <TrendingDown className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                              <span className={goal.intensity === 'low' ? 'font-semibold' : ''}>Low</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {formatDaysLeft(calculateDaysLeft(goal.end_date))}
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
                                className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {deleteState?.error && deletingGoalId === goal.id && (
                        <div className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-950/50 p-2 rounded border border-red-200 dark:border-red-900 mt-2">
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

