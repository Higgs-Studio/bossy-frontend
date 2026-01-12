import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getUserBossType, getUserBossLanguage } from '@/lib/supabase/queries';
import { BossSelector } from './boss-selector';

export default async function BossPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const [currentBossType, currentBossLanguage] = await Promise.all([
    getUserBossType(user.id),
    getUserBossLanguage(user.id),
  ]);

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Your AI Boss
          </h1>
          <p className="text-muted-foreground text-lg">Choose your accountability partner</p>
        </div>

        <BossSelector currentBossType={currentBossType} currentBossLanguage={currentBossLanguage} />
      </div>
    </div>
  );
}
