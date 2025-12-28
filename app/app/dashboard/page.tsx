import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  getActiveGoal,
  getTodayTask,
  getCheckInsForTask,
  getRecentBossEvents,
} from '@/lib/supabase/queries';
import { DashboardContent } from './dashboard-content';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const [activeGoal, todayTask, recentEvents] = await Promise.all([
    getActiveGoal(user.id),
    getTodayTask(user.id),
    getRecentBossEvents(user.id, 3),
  ]);

  let checkIn = null;
  if (todayTask) {
    const checkIns = await getCheckInsForTask(todayTask.id);
    checkIn = checkIns.find((ci) => ci.user_id === user.id) || null;
  }

  // Check if task is missed (no check-in by end of day)
  const today = new Date().toISOString().split('T')[0];
  const isMissed =
    todayTask &&
    !checkIn &&
    todayTask.task_date < today;

  return (
    <DashboardContent
      activeGoal={activeGoal}
      todayTask={todayTask}
      checkIn={checkIn}
      isMissed={isMissed}
      recentEvents={recentEvents}
    />
  );
}

