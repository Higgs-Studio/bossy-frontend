'use client';

import { useActionState, useState, useOptimistic, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, Check, X, Loader2, ListTodo } from 'lucide-react';
import { createTaskAction, updateTaskAction, deleteTaskAction, bulkDeleteTasksAction } from './actions';
import type { DailyTask } from '@/lib/supabase/queries';
import { useTranslation } from '@/contexts/translation-context';

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

  const [editDate, setEditDate] = useState('');

  const handleEditClick = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setEditText(task.task_text);
    setEditDate(task.task_date);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText('');
    setEditDate('');
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

  // Group tasks by date for better display
  const sortedTasks = [...optimisticTasks].sort((a, b) => 
    new Date(a.task_date).getTime() - new Date(b.task_date).getTime()
  );

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
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
            
            <div className="space-y-2">
              <Label htmlFor="taskDate">{t.tasks?.taskDate || 'Task Date'}</Label>
              <Input
                id="taskDate"
                name="taskDate"
                type="date"
                required
                min={startDate}
                max={endDate}
                defaultValue={new Date().toISOString().split('T')[0]}
              />
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
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edit-taskDate-${task.id}`} className="text-sm">{t.tasks?.taskDate || 'Task Date'}</Label>
                        <Input
                          id={`edit-taskDate-${task.id}`}
                          name="taskDate"
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          required
                          min={startDate}
                          max={endDate}
                        />
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
                        <div className="text-xs text-muted-foreground mb-1">
                          {new Date(task.task_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
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

