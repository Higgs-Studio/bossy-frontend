'use client';

import Link from 'next/link';
import { CircleIcon } from 'lucide-react';
import { useTranslation } from '@/contexts/translation-context';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[100dvh]">
      <div className="max-w-md space-y-8 p-4 text-center">
        <div className="flex justify-center">
          <CircleIcon className="size-12 text-slate-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          {t.errors.notFound.title}
        </h1>
        <p className="text-base text-gray-500">
          {t.errors.notFound.description}
        </p>
        <Link
          href="/"
          className="max-w-48 mx-auto flex justify-center py-2 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
        >
          {t.errors.notFound.backToHome}
        </Link>
      </div>
    </div>
  );
}
