'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { Plus, Trash2, Target, Calendar, Zap, AlertTriangle, CheckCircle2, XCircle, Pencil, Flame, TrendingUp, TrendingDown, Crown, Info } from 'lucide-react';
import Link from 'next/link';
import { deleteGoalAction } from '@/app/app/goal/actions';
import { updateGoalStatusAction, updateGoalIntensityAction } from '@/app/app/goals/[id]/actions';
import { useActionState, useState, useOptimistic, useTransition } from 'react';
import type { Goal } from '@/lib/supabase/queries';
import { useTranslation } from '@/contexts/translation-context';
import { useRouter } from 'next/navigation';

type GoalsListContentProps = {
  goals: Goal[];
  hasActiveSubscription: boolean;
  maxActiveGoals: number;
};

export function GoalsListContent({ goals: initialGoals, hasActiveSubscription, maxActiveGoals }: GoalsListContentProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'abandoned'>('active');
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(deleteGoalAction, null);
  const [optimisticGoals, setOptimisticGoals] = useOptimistic<Goal[]>(initialGoals);
  const [isPending, startTransition] = useTransition();
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ goalId: string; goalTitle: string } | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
  const [updatingStatusGoalId, setUpdatingStatusGoalId] = useState<string | null>(null);
  const [showIntensityMenu, setShowIntensityMenu] = useState<string | null>(null);
  const [updatingIntensityGoalId, setUpdatingIntensityGoalId] = useState<string | null>(null);

  const activeGoalsCount = optimisticGoals.filter((g) => g.status === 'active').length;
  const isAtLimit = !hasActiveSubscription && activeGoalsCount >= maxActiveGoals;
  const isNearLimit = !hasActiveSubscription && activeGoalsCount >= maxActiveGoals - 1;

  const handleCardClick = (goalId: string) => {
    router.push(`/app/goals/${goalId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, goalId: string, goalTitle: string) => {
    e.stopPropagation();
    setDeleteTarget({ goalId, goalTitle });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { goalId, goalTitle } = deleteTarget;
    setDeleteTarget(null);
    setDeletingGoalId(goalId);

    startTransition(async () => {
      setOptimisticGoals(optimisticGoals.filter(g => g.id !== goalId));
      const formData = new FormData();
      formData.append('goalId', goalId);
      await deleteFormAction(formData);
      setDeletingGoalId(null);
      toast(`"${goalTitle}" has been successfully deleted.`);
    });
  };

  const handleStatusUpdate = async (goalId: string, newStatus: 'active' | 'completed' | 'abandoned') => {
    const goal = optimisticGoals.find(g => g.id === goalId);
    const goalTitle = goal?.title || 'Goal';
    setUpdatingStatusGoalId(goalId);
    setShowStatusMenu(null);

    startTransition(async () => {
      setOptimisticGoals(optimisticGoals.map(g =>
        g.id === goalId ? { ...g, status: newStatus } : g
      ));
      await updateGoalStatusAction(goalId, newStatus);
      setUpdatingStatusGoalId(null);
      const statusLabels = {
        active: t.goals?.filterActive || 'Active',
        completed: t.goals?.filterCompleted || 'Completed',
        abandoned: t.goals?.filterAbandoned || 'Abandoned'
      };
      toast(`"${goalTitle}" status updated to ${statusLabels[newStatus]}.`);
    });
  };

  const handleIntensityUpdate = async (goalId: string, newIntensity: 'low' | 'medium' | 'high') => {
    const goal = optimisticGoals.find(g => g.id === goalId);
    const goalTitle = goal?.title || 'Goal';
    setUpdatingIntensityGoalId(goalId);
    setShowIntensityMenu(null);

    startTransition(async () => {
      setOptimisticGoals(optimisticGoals.map(g =>
        g.id === goalId ? { ...g, intensity: newIntensity } : g
      ));
      await updateGoalIntensityAction(goalId, newIntensity);
      setUpdatingIntensityGoalId(null);
      toast(`"${goalTitle}" intensity updated to ${newIntensity}.`);
    });
  };

  const filteredGoals =
    filter === 'all'
      ? optimisticGoals
      : optimisticGoals.filter((goal) => goal.status === filter);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
      completed: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
      abandoned: 'bg-muted text-muted-foreground border-border',
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
      abandoned: 'bg-gradient-to-br from-muted/50 to-background dark:from-muted/10 dark:to-background border-border',
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
    if (goal.total_tasks && goal.total_tasks > 0) {
      return Math.round(((goal.completed_tasks || 0) / goal.total_tasks) * 100);
    }
    return 0;
  };

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  const formatDaysLeft = (daysLeft: number) => {
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{t.goals?.title || 'Goals'}</h1>
            <p className="text-muted-foreground text-lg">{t.goals?.manageAll || 'Manage all your goals'}</p>
          </div>
          {isAtLimit ? (
            <Button size="lg" disabled>
              <Plus className="mr-2 h-4 w-4" />
              {t.goals?.createGoal || 'Create Goal'}
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/app/goal">
                <Plus className="mr-2 h-4 w-4" />
                {t.goals?.createGoal || 'Create Goal'}
              </Link>
            </Button>
          )}
        </div>

        {!hasActiveSubscription && (
          <Card className={`border-2 ${isAtLimit ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20' : isNearLimit ? 'border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20' : 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20'}`}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isAtLimit ? 'bg-red-100 dark:bg-red-900/50' : isNearLimit ? 'bg-yellow-100 dark:bg-yellow-900/50' : 'bg-blue-100 dark:bg-blue-900/50'}`}>
                  {isAtLimit ? (
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <Info className={`h-5 w-5 ${isNearLimit ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${isAtLimit ? 'text-red-900 dark:text-red-100' : isNearLimit ? 'text-yellow-900 dark:text-yellow-100' : 'text-blue-900 dark:text-blue-100'}`}>
                    {isAtLimit
                      ? `Active Goal Limit Reached (${activeGoalsCount}/${maxActiveGoals})`
                      : `Active Goals: ${activeGoalsCount}/${maxActiveGoals}`
                    }
                  </p>
                  <p className={`text-sm mt-1 ${isAtLimit ? 'text-red-800 dark:text-red-200' : isNearLimit ? 'text-yellow-800 dark:text-yellow-200' : 'text-blue-800 dark:text-blue-200'}`}>
                    {isAtLimit
                      ? 'You\'ve reached the maximum number of active goals on the Free plan. Complete or abandon a goal to create a new one, or upgrade to Plus for unlimited goals.'
                      : `You're on the Free plan. Upgrade to Plus for unlimited active goals and more features.`
                    }
                  </p>
                  <Button asChild variant={isAtLimit ? 'default' : 'outline'} size="sm" className="mt-3">
                    <Link href="/app/profile#subscription">
                      <Crown className="mr-2 h-4 w-4" />
                      {isAtLimit ? 'Upgrade to Plus for Unlimited Goals' : 'Upgrade to Plus'}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                    ? 'bg-primary text-primary-foreground'
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
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCardClick(goal.id); }}
                          className="p-1.5 rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                          title={t.goals?.edit || 'Edit'}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, goal.id, goal.title)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          disabled={deletingGoalId === goal.id || isPending}
                          title={t.goals?.delete || 'Delete'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowStatusMenu(showStatusMenu === goal.id ? null : goal.id); }}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(goal.status)} hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1`}
                          disabled={updatingStatusGoalId === goal.id}
                        >
                          {getStatusIcon(goal.status)}
                          <span>{updatingStatusGoalId === goal.id ? '...' : (t.goals?.status?.[goal.status as keyof typeof t.goals.status] || goal.status)}</span>
                        </button>
                        {showStatusMenu === goal.id && (
                          <div className="absolute left-0 top-full mt-2 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                            {(['active', 'completed', 'abandoned'] as const).map(s => (
                              <button
                                key={s}
                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(goal.id, s); }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                disabled={goal.status === s}
                              >
                                {getStatusIcon(s)}
                                <span className={goal.status === s ? 'font-semibold' : ''}>
                                  {s === 'active' ? (t.goals?.filterActive || 'Active') : s === 'completed' ? (t.goals?.filterCompleted || 'Completed') : (t.goals?.filterAbandoned || 'Abandoned')}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowIntensityMenu(showIntensityMenu === goal.id ? null : goal.id); }}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getIntensityBadge(goal.intensity)} hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1`}
                          disabled={updatingIntensityGoalId === goal.id}
                        >
                          {getIntensityIcon(goal.intensity)}
                          <span className="capitalize">{updatingIntensityGoalId === goal.id ? '...' : goal.intensity}</span>
                        </button>
                        {showIntensityMenu === goal.id && (
                          <div className="absolute left-0 top-full mt-2 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                            {(['high', 'medium', 'low'] as const).map(i => (
                              <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); handleIntensityUpdate(goal.id, i); }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                                disabled={goal.intensity === i}
                              >
                                {getIntensityIcon(i)}
                                <span className={`capitalize ${goal.intensity === i ? 'font-semibold' : ''}`}>{i}</span>
                              </button>
                            ))}
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
                          <span className="font-medium">{formatDaysLeft(calculateDaysLeft(goal.end_date))}</span>
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
                        <div className="text-destructive text-xs bg-destructive/10 p-2 rounded border border-destructive/20 mt-2">
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

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t.goals?.delete || 'Delete'} {t.goal?.title || 'Goal'}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{deleteTarget?.goalTitle}</strong>? This action cannot be undone. All associated tasks and progress will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.common?.cancel || 'Cancel'}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t.goals?.delete || 'Delete'} {t.goal?.title || 'Goal'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
