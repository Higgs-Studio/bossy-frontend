import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { AppHeader } from './app-header';
import { UserMenu } from './user-menu';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <section className="flex flex-col min-h-screen">
      <AppHeader userMenu={<UserMenu user={user} />} />
      {children}
    </section>
  );
}

