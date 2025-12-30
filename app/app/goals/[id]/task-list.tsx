'use client';

import { useActionState, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, Check, X, Loader2, ListTodo } from 'lucide-react';
import { createTaskAction, updateTaskAction, deleteTaskAction } from './actions';
import type { DailyTask } from '@/lib/supabase/queries';

type TaskListProps = {
  goalId: string;
  tasks: DailyTask[];
  startDate: string;
  endDate: string;
};

export function TaskList({ goalId, tasks, startDate, endDate }: TaskListProps) {
  const [createState, createFormAction, isCreatePending] = useActionState(createTaskAction, null);
  const [updateState, updateFormAction, isUpdatePending] = useActionState(updateTaskAction, null);
  const [deleteState, deleteFormAction, isDeletePending] = useActionState(deleteTaskAction, null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditClick = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setEditText(task.task_text);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditText('');
  };

  // Group tasks by date for better display
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.task_date).getTime() - new Date(b.task_date).getTime()
  );

  return (
    <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            Tasks ({tasks.length})
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? 'outline' : 'default'}
          >
            {showAddForm ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Task Form */}
        {showAddForm && (
          <form action={createFormAction} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <input type="hidden" name="goalId" value={goalId} />
            
            <div className="space-y-2">
              <Label htmlFor="taskDate">Task Date</Label>
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
              <Label htmlFor="taskText">Task Description</Label>
              <Input
                id="taskText"
                name="taskText"
                type="text"
                required
                placeholder="What do you need to do?"
                maxLength={500}
              />
            </div>

            {createState?.error && (
              <div className="text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {createState.error}
              </div>
            )}

            <Button type="submit" disabled={isCreatePending} className="w-full">
              {isCreatePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Task...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
          </form>
        )}

        {/* Error displays */}
        {updateState?.error && (
          <div className="text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {updateState.error}
          </div>
        )}
        {deleteState?.error && (
          <div className="text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {deleteState.error}
          </div>
        )}

        {/* Task List */}
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <ListTodo className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No tasks yet. Add your first task!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                {editingTaskId === task.id ? (
                  // Edit Mode
                  <form action={updateFormAction} className="space-y-3">
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="goalId" value={goalId} />
                    
                    <Input
                      name="taskText"
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      required
                      maxLength={500}
                      autoFocus
                    />
                    
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" disabled={isUpdatePending}>
                        {isUpdatePending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Save
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
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">
                        {new Date(task.task_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <p className="text-slate-800">{task.task_text}</p>
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
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

