import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getActiveGoal } from '@/lib/supabase/queries';
import { getBossPersonality } from '@/lib/boss/reactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BossPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const activeGoal = await getActiveGoal(user.id);
  const boss = getBossPersonality(activeGoal?.boss_type);

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Your AI Boss
          </h1>
          <p className="text-slate-600 text-lg">Meet your accountability partner</p>
        </div>

        <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{boss.avatar}</span>
              <div>
                <CardTitle className="text-2xl">{boss.name}</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Your AI Accountability Partner</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-800 leading-relaxed text-base">{boss.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-4 text-lg">
                Rules
              </h3>
              <ul className="space-y-3">
                {boss.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <span className="text-slate-400 font-medium mt-0.5">•</span>
                    <span className="text-slate-800 leading-relaxed flex-1">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-slate-900 font-semibold text-base mb-2">
                No Negotiations
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                This boss does not negotiate. Commitments are final. Accountability is non-negotiable.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

