'use client';

import { useActionState, useState, useOptimistic, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Edit2, Trash2, Check, X, Loader2, ListTodo, Calendar as CalendarIcon, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { createTaskAction, updateTaskAction, deleteTaskAction, bulkDeleteTasksAction, updateTaskStatusAction } from './actions';
import type { DailyTask } from '@/lib/supabase/queries';
import { useTranslation } from '@/contexts/translation-context';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type TaskListProps = {
  goalId: string;
  tasks: DailyTask[];
  startDate: string;
  endDate: string;
};

export function TaskList({ goalId, tasks: initialTasks, startDate, endDate }: TaskListProps) {
  const { t } = useTranslation();
  const [createState, createFormAction, isCreatePending] = useActionState(createTaskAction, null);
  const [updateState, updateFormAction, isUpdatePending] = useActionState(updateTaskAction, null);
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(deleteTaskAction, null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [optimisticTasks, setOptimisticTasks] = useOptimistic<DailyTask[]>(initialTasks);
  const [isPending, startTransition] = useTransition();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [addTaskDate, setAddTaskDate] = useState<Date>(new Date());
  const [showAddTaskCalendar, setShowAddTaskCalendar] = useState(false);
  const [showEditTaskCalendar, setShowEditTaskCalendar] = useState<string | null>(null);

  const [editStatus, setEditStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');

  const handleEditClick = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setEditText(task.task_text);
    setEditDate(new Date(task.task_date));
    setEditStatus(task.status || 'todo');
    setShowEditTaskCalendar(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText('');
    setEditDate(undefined);
    setShowEditTaskCalendar(null);
  };

  const handleToggleTask = (taskId: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleToggleAll = () => {
    if (selectedTasks.size === sortedTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(sortedTasks.map(t => t.id)));
    }
  };

  const handleBulkDelete = async () => {
    const taskIdsArray = Array.from(selectedTasks);
    
    // Optimistic update
    startTransition(() => {
      setOptimisticTasks(optimisticTasks.filter(t => !selectedTasks.has(t.id)));
    });

    // Clear selection
    setSelectedTasks(new Set());

    // Execute bulk delete
    await bulkDeleteTasksAction(goalId, taskIdsArray);
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    setUpdatingTaskId(taskId);

    // Optimistic update
    startTransition(() => {
      setOptimisticTasks(optimisticTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ));
    });

    // Execute the actual update
    await updateTaskStatusAction(taskId, goalId, newStatus);
    setUpdatingTaskId(null);
  };

  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      todo: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-700',
      in_progress: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700',
      done: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
    };
    return colors[status] || colors.todo;
  };

  const getTaskStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactElement> = {
      todo: <Circle className="h-3.5 w-3.5" />,
      in_progress: <Clock className="h-3.5 w-3.5" />,
      done: <CheckCircle2 className="h-3.5 w-3.5" />,
    };
    return icons[status] || icons.todo;
  };

  const getTaskStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done',
    };
    return labels[status] || labels.todo;
  };

  const calculateProgress = () => {
    if (optimisticTasks.length === 0) return 0;
    const completedTasks = optimisticTasks.filter(t => t.status === 'done').length;
    return Math.round((completedTasks / optimisticTasks.length) * 100);
  };

  // Group tasks by date for better display
  const sortedTasks = [...optimisticTasks].sort((a, b) => 
    new Date(a.task_date).getTime() - new Date(b.task_date).getTime()
  );

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <CardTitle className="flex items-center gap-2">
              {sortedTasks.length > 0 && (
                <input
                  type="checkbox"
                  checked={sortedTasks.length > 0 && selectedTasks.size === sortedTasks.length}
                  onChange={handleToggleAll}
                  className="h-4 w-4 rounded border-border"
                  title={t.tasks?.selectAll || 'Select all tasks'}
                />
              )}
              <ListTodo className="h-5 w-5 text-primary" />
              {t.tasks?.title || 'Tasks'} ({optimisticTasks.length})
            </CardTitle>
            {optimisticTasks.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                  <span className="font-semibold text-xs">{calculateProgress()}%</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedTasks.size > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.tasks?.deleting || 'Deleting...'}
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t.tasks?.deleteSelected?.replace('{count}', selectedTasks.size.toString()) || `Delete ${selectedTasks.size} Selected`}
                  </>
                )}
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? 'outline' : 'default'}
            >
              {showAddForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  {t.tasks?.cancel || 'Cancel'}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t.tasks?.addTask || 'Add Task'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Task Form */}
        {showAddForm && (
          <form action={createFormAction} className="p-4 bg-muted/50 rounded-lg border border-border space-y-4">
            <input type="hidden" name="goalId" value={goalId} />
            <input type="hidden" name="taskDate" value={addTaskDate.toISOString().split('T')[0]} />
            
            <div className="space-y-2">
              <Label htmlFor="task-date-btn">{t.tasks?.taskDate || 'Task Date'}</Label>
              <Button
                id="task-date-btn"
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !addTaskDate && "text-muted-foreground"
                )}
                onClick={() => {
                  setShowAddTaskCalendar(!showAddTaskCalendar);
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {addTaskDate ? format(addTaskDate, 'PPP') : <span>{t.tasks?.pickDate || 'Pick a date'}</span>}
              </Button>
              {showAddTaskCalendar && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowAddTaskCalendar(false)}
                  />
                  <div className="relative">
                    <div className="absolute z-50 bg-popover border border-border rounded-lg shadow-lg p-3 mt-1 left-0">
                      <Calendar
                        mode="single"
                        selected={addTaskDate}
                        onSelect={(date) => {
                          if (date) {
                            setAddTaskDate(date);
                          }
                          setShowAddTaskCalendar(false);
                        }}
                        disabled={(date) => {
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          start.setHours(0, 0, 0, 0);
                          end.setHours(23, 59, 59, 999);
                          return date < start || date > end;
                        }}
                        initialFocus
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskText">{t.tasks?.taskDescription || 'Task Description'}</Label>
              <Input
                id="taskText"
                name="taskText"
                type="text"
                required
                placeholder={t.tasks?.taskPlaceholder || 'What do you need to do?'}
                maxLength={500}
              />
            </div>

            {createState?.error && (
              <div className="text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/50 p-3 rounded-lg border border-red-200 dark:border-red-900">
                {createState.error}
              </div>
            )}

            <Button type="submit" disabled={isCreatePending} className="w-full">
              {isCreatePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.tasks?.addingTask || 'Adding Task...'}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t.tasks?.addTask || 'Add Task'}
                </>
              )}
            </Button>
          </form>
        )}

        {/* Error displays */}
        {updateState?.error && (
          <div className="text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/50 p-3 rounded-lg border border-red-200 dark:border-red-900">
            {updateState.error}
          </div>
        )}
        {deleteState?.error && (
          <div className="text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/50 p-3 rounded-lg border border-red-200 dark:border-red-900">
            {deleteState.error}
          </div>
        )}

        {/* Task List */}
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ListTodo className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>{t.tasks?.noTasks || 'No tasks yet. Add your first task!'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-background rounded-lg border border-border hover:border-border/80 transition-colors flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedTasks.has(task.id)}
                  onChange={() => handleToggleTask(task.id)}
                  className="mt-1 h-4 w-4 rounded border-border"
                  disabled={editingTaskId === task.id}
                />
                <div className="flex-1">
                  {editingTaskId === task.id ? (
                    // Edit Mode
                    <form action={updateFormAction} className="space-y-3 w-full">
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="goalId" value={goalId} />
                      <input type="hidden" name="taskDate" value={editDate ? editDate.toISOString().split('T')[0] : ''} />
                      <input type="hidden" name="taskStatus" value={editStatus} />
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Task Status</Label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditStatus('todo')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-all ${
                              editStatus === 'todo' 
                                ? 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-700 ring-2 ring-slate-400' 
                                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                            }`}
                          >
                            <Circle className="h-3 w-3" />
                            To Do
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditStatus('in_progress')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-all ${
                              editStatus === 'in_progress' 
                                ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700 ring-2 ring-amber-400' 
                                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            In Progress
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditStatus('done')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-all ${
                              editStatus === 'done' 
                                ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 ring-2 ring-green-400' 
                                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Done
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`edit-taskDate-btn-${task.id}`} className="text-sm">{t.tasks?.taskDate || 'Task Date'}</Label>
                        <Button
                          id={`edit-taskDate-btn-${task.id}`}
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editDate && "text-muted-foreground"
                          )}
                          onClick={() => {
                            setShowEditTaskCalendar(showEditTaskCalendar === task.id ? null : task.id);
                          }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editDate ? format(editDate, 'PPP') : <span>{t.tasks?.pickDate || 'Pick a date'}</span>}
                        </Button>
                        {showEditTaskCalendar === task.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setShowEditTaskCalendar(null)}
                            />
                            <div className="relative">
                              <div className="absolute z-50 bg-popover border border-border rounded-lg shadow-lg p-3 mt-1 left-0">
                                <Calendar
                                  mode="single"
                                  selected={editDate}
                                  onSelect={(date) => {
                                    if (date) {
                                      setEditDate(date);
                                    }
                                    setShowEditTaskCalendar(null);
                                  }}
                                  disabled={(date) => {
                                    const start = new Date(startDate);
                                    const end = new Date(endDate);
                                    start.setHours(0, 0, 0, 0);
                                    end.setHours(23, 59, 59, 999);
                                    return date < start || date > end;
                                  }}
                                  initialFocus
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edit-taskText-${task.id}`} className="text-sm">{t.tasks?.taskDescription || 'Task Description'}</Label>
                        <Input
                          id={`edit-taskText-${task.id}`}
                          name="taskText"
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          required
                          maxLength={500}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={isUpdatePending}>
                          {isUpdatePending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="mr-1 h-4 w-4" />
                              {t.tasks?.save || 'Save'}
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="mr-1 h-4 w-4" />
                          {t.tasks?.cancel || 'Cancel'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between gap-4 w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-xs text-muted-foreground">
                            {new Date(task.task_date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <button
                            onClick={() => {
                              const statusCycle: Record<string, 'todo' | 'in_progress' | 'done'> = {
                                todo: 'in_progress',
                                in_progress: 'done',
                                done: 'todo',
                              };
                              handleTaskStatusUpdate(task.id, statusCycle[task.status || 'todo']);
                            }}
                            disabled={updatingTaskId === task.id}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 hover:opacity-80 transition-opacity ${getTaskStatusColor(task.status || 'todo')}`}
                          >
                            {getTaskStatusIcon(task.status || 'todo')}
                            <span>{updatingTaskId === task.id ? '...' : getTaskStatusLabel(task.status || 'todo')}</span>
                          </button>
                        </div>
                        <p className="text-foreground">{task.task_text}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(task)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <form action={deleteFormAction}>
                          <input type="hidden" name="taskId" value={task.id} />
                          <input type="hidden" name="goalId" value={goalId} />
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50"
                            disabled={isDeletePending}
                          >
                            {isDeletePending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

