import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getUserBossType } from '@/lib/supabase/queries';
import { BossSelector } from './boss-selector';

export default async function BossPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const currentBossType = await getUserBossType(user.id);

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Your AI Boss
          </h1>
          <p className="text-slate-600 text-lg">Choose your accountability partner</p>
        </div>

        <BossSelector currentBossType={currentBossType} />
      </div>
    </div>
  );
}
