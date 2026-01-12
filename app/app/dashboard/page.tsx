import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  getActiveGoal,
  getUserGoals,
  getTodayTask,
  getCheckInsForTask,
  getRecentBossEvents,
  getUserBossType,
} from '@/lib/supabase/queries';
import { DashboardContent } from './dashboard-content';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Get all goals and find active ones
  const allGoals = await getUserGoals(user.id);
  const activeGoals = allGoals.filter((g) => g.status === 'active');
  
  // Use the most recent active goal, or first active goal if multiple exist
  // This maintains backward compatibility with getTodayTask which expects one active goal
  const activeGoal = activeGoals.length > 0 ? activeGoals[0] : null;

  const [todayTask, recentEvents, bossType] = await Promise.all([
    getTodayTask(user.id), // This will return null if no active goal
    getRecentBossEvents(user.id, 3),
    getUserBossType(user.id),
  ]);

  let checkIn = null;
  if (todayTask) {
    const checkIns = await getCheckInsForTask(todayTask.id);
    checkIn = checkIns.find((ci) => ci.user_id === user.id) || null;
  }

  // Check if task is missed (no check-in by end of day)
  const today = new Date().toISOString().split('T')[0];
  const isMissed = Boolean(
    todayTask &&
    !checkIn &&
    todayTask.task_date < today
  );

  return (
    <DashboardContent
      activeGoal={activeGoal}
      todayTask={todayTask}
      checkIn={checkIn}
      isMissed={isMissed}
      recentEvents={recentEvents}
      bossType={bossType}
    />
  );
}

