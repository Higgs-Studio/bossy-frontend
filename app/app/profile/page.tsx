import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { getTeamForUser } from '@/lib/db/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, CreditCard, Settings } from 'lucide-react';
import { manageSubscriptionAction } from './actions';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Get user's subscription data (stored as "team" but represents individual subscription)
  const subscriptionData = await getTeamForUser();

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Profile
          </h1>
          <p className="text-slate-600 text-lg">Manage your account and subscription</p>
        </div>

        {/* Account Information */}
        <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-slate-600" />
              <CardTitle>Account Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p className="text-base text-slate-900 mt-1">{user.email || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">User ID</label>
                <p className="text-base text-slate-900 mt-1 font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Account Created</label>
                <p className="text-base text-slate-900 mt-1">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Management */}
        <Card className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-slate-600" />
              <CardTitle>Subscription</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptionData ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Status</label>
                    <p className="text-base text-slate-900 mt-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          subscriptionData.subscriptionStatus === 'active' ||
                          subscriptionData.subscriptionStatus === 'trialing'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {subscriptionData.subscriptionStatus
                          ? subscriptionData.subscriptionStatus.charAt(0).toUpperCase() +
                            subscriptionData.subscriptionStatus.slice(1)
                          : 'No subscription'}
                      </span>
                    </p>
                  </div>
                  {subscriptionData.planName && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Plan</label>
                      <p className="text-base text-slate-900 mt-1">{subscriptionData.planName}</p>
                    </div>
                  )}
                  {subscriptionData.stripeCustomerId && (
                    <div className="pt-4">
                      <form action={manageSubscriptionAction}>
                        <Button type="submit" className="w-full sm:w-auto">
                          <Settings className="mr-2 h-4 w-4" />
                          Manage Subscription
                        </Button>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-600 mb-4">No active subscription</p>
                  <Button asChild>
                    <a href="/pricing">View Pricing Plans</a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

