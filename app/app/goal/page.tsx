'use client';

import { GoalForm } from './goal-form';
import { useTranslation } from '@/contexts/translation-context';

export default function GoalPage() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
          {t.goal.createTitle}
        </h1>
        <GoalForm />
      </div>
    </div>
  );
}

