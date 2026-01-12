'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { DailyTask } from '@/lib/supabase/queries';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isSameMonth, isToday } from 'date-fns';
import { useTranslation } from '@/contexts/translation-context';

type GoalCalendarProps = {
  tasks: DailyTask[];
  startDate: string;
  endDate: string;
};

export function GoalCalendar({ tasks, startDate, endDate }: GoalCalendarProps) {
  const { t } = useTranslation();
  const goalStart = new Date(startDate);
  const goalEnd = new Date(endDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = monthStart.getDay();

  // Create array with empty slots for days before month starts
  const calendarDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.task_date), date));
  };

  const isDateInGoalRange = (date: Date) => {
    return date >= goalStart && date <= goalEnd;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {t.calendar?.taskCalendar || 'Task Calendar'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-semibold min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayTasks = getTasksForDate(date);
            const isInRange = isDateInGoalRange(date);
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isTodayDate = isToday(date);

            return (
              <div
                key={date.toISOString()}
                className={`aspect-square p-1 rounded-lg border transition-colors ${
                  !isCurrentMonth
                    ? 'bg-muted/30 text-muted-foreground/50 border-transparent'
                    : isInRange
                    ? dayTasks.length > 0
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-950/50'
                      : 'bg-background border-border hover:bg-muted/50'
                    : 'bg-muted/50 border-transparent text-muted-foreground'
                } ${isTodayDate ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' : ''}`}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-xs font-medium ${isTodayDate ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}`}>
                    {format(date, 'd')}
                  </div>
                  {isInRange && dayTasks.length > 0 && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex flex-wrap gap-0.5 justify-center">
                        {dayTasks.slice(0, 3).map((task, idx) => (
                          <div
                            key={task.id}
                            className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                            title={task.task_text}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400">
                            +{dayTasks.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-indigo-600 dark:border-indigo-400" />
            <span>{t.calendar?.today || 'Today'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900" />
            <span>{t.calendar?.hasTasks || 'Has tasks'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted/50 border-transparent" />
            <span>{t.calendar?.outsideRange || 'Outside goal range'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
