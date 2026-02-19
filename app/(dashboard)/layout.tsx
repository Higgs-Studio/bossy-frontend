import { PublicHeader } from '@/components/public-header';
import { getUser } from '@/lib/supabase/get-session';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <section className="flex flex-col min-h-screen">
      <PublicHeader user={user ? { id: user.id, email: user.email ?? undefined } : null} />
      {children}
    </section>
  );
}
