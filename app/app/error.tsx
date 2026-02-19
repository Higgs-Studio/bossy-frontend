'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/translation-context';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-6">
      <div className="text-center max-w-md space-y-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 mx-auto">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{t.errors.app.title}</h2>
        <p className="text-muted-foreground">
          {t.errors.app.description}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset}>{t.common.tryAgain}</Button>
          <Button variant="outline" asChild>
            <Link href="/app/dashboard">{t.errors.app.dashboardCta}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
