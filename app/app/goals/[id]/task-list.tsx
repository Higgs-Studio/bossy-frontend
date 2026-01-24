'use client';

import { useActionState, useState, useOptimistic, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Edit2, Trash2, Check, X, Loader2, ListTodo, Calendar as CalendarIcon, Circle, Clock, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import { createTaskAction, updateTaskAction, deleteTaskAction, bulkDeleteTasksAction, updateTaskStatusAction } from './actions';
import type { DailyTask } from '@/lib/supabase/queries';
import { useTranslation } from '@/contexts/translation-context';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TaskListProps = {
  goalId: string;
  tasks: DailyTask[];
  startDate: string;
  endDate: string;
  onTasksChange?: () => Promise<void>;
};

export function TaskList({ goalId, tasks: initialTasks, startDate, endDate, onTasksChange }: TaskListProps) {
  const { t } = useTranslation();
  const [createState, createFormAction, isCreatePending] = useActionState(createTaskAction, null);
  const [updateState, updateFormAction, isUpdatePending] = useActionState(updateTaskAction, null);
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(deleteTaskAction, null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState<Date>(new Date());
  const [editStatus, setEditStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
  const [showEditCalendar, setShowEditCalendar] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [optimisticTasks, setOptimisticTasks] = useOptimistic<DailyTask[]>(initialTasks);
  const [isPending, startTransition] = useTransition();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<{show: boolean; message: string}>({
    show: false,
    message: ''
  });

  const [addTaskDate, setAddTaskDate] = useState<Date>(new Date());
  const [showAddTaskCalendar, setShowAddTaskCalendar] = useState(false);

  const showNotification = (message: string) => {
    setShowSuccessMessage({ show: true, message });
    setTimeout(() => {
      setShowSuccessMessage({ show: false, message: '' });
    }, 4000);
  };

  // Watch for successful task creation
  useEffect(() => {
    if (!isCreatePending && createState === null && showAddForm) {
      // Task was successfully created (state is null and not pending)
      const prevTaskCount = optimisticTasks.length;
      if (initialTasks.length > prevTaskCount) {
        showNotification('Task created successfully.');
        setShowAddForm(false);
        onTasksChange?.();
      }
    }
  }, [isCreatePending, createState, showAddForm, optimisticTasks.length, initialTasks.length, onTasksChange]);

  // Watch for successful task update
  useEffect(() => {
    if (!isUpdatePending && updateState === null && editingTaskId) {
      // Task was successfully updated
      showNotification('Task updated successfully.');
      setEditingTaskId(null);
      setEditText('');
      onTasksChange?.();
    }
  }, [isUpdatePending, updateState, editingTaskId, onTasksChange]);

  // Watch for successful task deletion
  useEffect(() => {
    if (!isDeletePending && deleteState === null) {
      // Task was successfully deleted
      const prevTaskCount = optimisticTasks.length;
      if (initialTasks.length < prevTaskCount) {
        showNotification('Task deleted successfully.');
        onTasksChange?.();
      }
    }
  }, [isDeletePending, deleteState, optimisticTasks.length, initialTasks.length, onTasksChange]);

  const handleEditClick = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setEditText(task.task_text);
    setEditDate(new Date(task.task_date));
    setEditStatus(task.status || 'todo');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText('');
    setShowEditCalendar(false);
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

  const handleBulkDelete = () => {
    const taskIdsArray = Array.from(selectedTasks);
    const count = taskIdsArray.length;
    
    // Optimistic update and execute bulk delete in transition
    startTransition(async () => {
      setOptimisticTasks(optimisticTasks.filter(t => !selectedTasks.has(t.id)));
      setSelectedTasks(new Set());

      // Execute bulk delete
      await bulkDeleteTasksAction(goalId, taskIdsArray);
      
      // Show success message
      showNotification(`${count} task${count > 1 ? 's' : ''} deleted successfully.`);
      
      // Refresh data
      await onTasksChange?.();
    });
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    setUpdatingTaskId(taskId);

    // Optimistic update and execute the update in transition
    startTransition(async () => {
      setOptimisticTasks(optimisticTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ));

      // Execute the actual update
      await updateTaskStatusAction(taskId, goalId, newStatus);
      setUpdatingTaskId(null);
      
      // Show success message
      const statusLabels = {
        todo: 'To Do',
        in_progress: 'In Progress',
        done: 'Done'
      };
      showNotification(`Task status updated to ${statusLabels[newStatus]}.`);
      
      // Refresh data
      await onTasksChange?.();
    });
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
                    // Edit Mode - Full edit form
                    <form action={updateFormAction} className="space-y-3 w-full p-4 bg-muted/30 rounded-lg border border-border">
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="goalId" value={goalId} />
                      <input type="hidden" name="taskDate" value={editDate.toISOString().split('T')[0]} />
                      <input type="hidden" name="taskStatus" value={editStatus} />
                      
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`edit-taskText-${task.id}`}>{t.tasks?.taskDescription || 'Task Description'}</Label>
                          <Input
                            id={`edit-taskText-${task.id}`}
                            name="taskText"
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            required
                            maxLength={500}
                            placeholder={t.tasks?.taskPlaceholder || 'What do you need to do?'}
                            autoFocus
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`edit-task-date-btn-${task.id}`}>{t.tasks?.taskDate || 'Task Date'}</Label>
                          <Button
                            id={`edit-task-date-btn-${task.id}`}
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !editDate && "text-muted-foreground"
                            )}
                            onClick={() => setShowEditCalendar(!showEditCalendar)}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editDate ? format(editDate, 'PPP') : <span>{t.tasks?.pickDate || 'Pick a date'}</span>}
                          </Button>
                          {showEditCalendar && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setShowEditCalendar(false)}
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
                                      setShowEditCalendar(false);
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
                          <Label htmlFor={`edit-status-${task.id}`}>{t.tasks?.status || 'Status'}</Label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditStatus('todo')}
                              className={cn(
                                "flex-1 px-3 py-2 rounded-md text-xs font-medium border transition-all",
                                editStatus === 'todo'
                                  ? 'bg-slate-100 text-slate-700 border-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600'
                                  : 'bg-background border-border hover:border-border/80'
                              )}
                            >
                              <Circle className="h-3.5 w-3.5 mx-auto mb-1" />
                              To Do
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditStatus('in_progress')}
                              className={cn(
                                "flex-1 px-3 py-2 rounded-md text-xs font-medium border transition-all",
                                editStatus === 'in_progress'
                                  ? 'bg-amber-100 text-amber-700 border-amber-400 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700'
                                  : 'bg-background border-border hover:border-border/80'
                              )}
                            >
                              <Clock className="h-3.5 w-3.5 mx-auto mb-1" />
                              In Progress
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditStatus('done')}
                              className={cn(
                                "flex-1 px-3 py-2 rounded-md text-xs font-medium border transition-all",
                                editStatus === 'done'
                                  ? 'bg-green-100 text-green-700 border-green-400 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700'
                                  : 'bg-background border-border hover:border-border/80'
                              )}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mx-auto mb-1" />
                              Done
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button type="submit" disabled={isUpdatePending} className="flex-1">
                            {isUpdatePending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.tasks?.saving || 'Saving...'}
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                {t.tasks?.save || 'Save'}
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="flex-1"
                          >
                            <X className="mr-2 h-4 w-4" />
                            {t.tasks?.cancel || 'Cancel'}
                          </Button>
                        </div>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                disabled={updatingTaskId === task.id}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 hover:opacity-80 transition-opacity ${getTaskStatusColor(task.status || 'todo')}`}
                              >
                                {getTaskStatusIcon(task.status || 'todo')}
                                <span>{updatingTaskId === task.id ? '...' : getTaskStatusLabel(task.status || 'todo')}</span>
                                <ChevronDown className="h-3 w-3 ml-0.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => handleTaskStatusUpdate(task.id, 'todo')}
                                className="flex items-center gap-2"
                              >
                                <Circle className="h-3.5 w-3.5" />
                                To Do
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleTaskStatusUpdate(task.id, 'in_progress')}
                                className="flex items-center gap-2"
                              >
                                <Clock className="h-3.5 w-3.5" />
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleTaskStatusUpdate(task.id, 'done')}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Done
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Success Message */}
      {showSuccessMessage.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 shadow-lg">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    {showSuccessMessage.message}
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccessMessage({ show: false, message: '' })}
                  className="flex-shrink-0 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}

