'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function PublicUserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (user) {
    router.push('/app/dashboard');
    return null;
  }

  return (
    <>
      <Link
        href="/pricing"
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        Pricing
      </Link>
      <Button asChild className="rounded-full">
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </>
  );
}


