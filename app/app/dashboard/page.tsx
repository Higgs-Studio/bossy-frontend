import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  getActiveGoals,
  getRecentBossEvents,
  getUserBossType,
  getDashboardKPIs,
  getDashboardTasks,
} from '@/lib/supabase/queries';
import { DashboardContent } from './dashboard-content';

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Get all active goals
  const activeGoals = await getActiveGoals(user.id);
  
  // Use the most recent active goal for backward compatibility with UI
  const activeGoal = activeGoals.length > 0 ? activeGoals[0] : null;

  const [recentEvents, bossType, kpis, dashboardTasks] = await Promise.all([
    getRecentBossEvents(user.id, 3),
    getUserBossType(user.id),
    getDashboardKPIs(user.id),
    getDashboardTasks(user.id),
  ]);

  return (
    <DashboardContent
      activeGoal={activeGoal}
      recentEvents={recentEvents}
      bossType={bossType}
      kpis={kpis}
      dashboardTasks={dashboardTasks}
    />
  );
}

