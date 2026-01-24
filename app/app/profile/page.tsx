'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, CreditCard, Settings } from 'lucide-react';
import { manageSubscriptionAction } from './actions';
import { ProfileSettings } from './profile-settings';
import { PersonalInfo } from './personal-info';
import { useTranslation } from '@/contexts/translation-context';
import { useEffect, useState } from 'react';
import { getProfileData } from './actions';

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileData().then(data => {
      setProfileData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">{t.nav?.loading || 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {t.profile?.title || 'Profile'}
          </h1>
          <p className="text-muted-foreground text-lg">{t.profile?.subtitle || 'Manage your account and subscription'}</p>
        </div>

        {/* Account Information */}
        <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t.profile?.accountInfo || 'Account Information'}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.profile?.email || 'Email'}</label>
                <p className="text-base text-foreground mt-1">{profileData?.user?.email || (t.profile?.notSet || 'Not set')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.profile?.userId || 'User ID'}</label>
                <p className="text-base text-foreground mt-1 font-mono text-sm">{profileData?.user?.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.profile?.accountCreated || 'Account Created'}</label>
                <p className="text-base text-foreground mt-1">
                  {profileData?.user?.created_at
                    ? new Date(profileData.user.created_at).toLocaleDateString('en-US', {
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

        {/* Personal Information */}
        <PersonalInfo initialPhone={profileData?.userPreferences?.phone_no} />

        {/* App Settings */}
        <ProfileSettings />

        {/* Subscription Management */}
        <Card id="subscription" className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200 scroll-mt-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t.profile?.subscription || 'Subscription'}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileData?.subscriptionData ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t.profile?.status || 'Status'}</label>
                    <p className="text-base text-foreground mt-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          profileData.subscriptionData.subscription_status === 'active' ||
                          profileData.subscriptionData.subscription_status === 'trialing'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                            : profileData.subscriptionData.subscription_status === 'free'
                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-muted text-foreground border border-border'
                        }`}
                      >
                        {profileData.subscriptionData.subscription_status
                          ? profileData.subscriptionData.subscription_status.charAt(0).toUpperCase() +
                            profileData.subscriptionData.subscription_status.slice(1)
                          : 'Free'}
                      </span>
                    </p>
                  </div>
                  {profileData.subscriptionData.plan_name && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t.profile?.plan || 'Plan'}</label>
                      <p className="text-base text-foreground mt-1">
                        {profileData.subscriptionData.plan_name}
                        {profileData.subscriptionData.billing_interval && (
                          <span className="text-sm text-muted-foreground ml-2">
                            (Billed {profileData.subscriptionData.billing_interval === 'year' ? 'Yearly' : 'Monthly'})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {profileData.subscriptionData.stripe_customer_id && profileData.subscriptionData.subscription_status === 'active' ? (
                    <div className="pt-4">
                      <form action={manageSubscriptionAction}>
                        <Button type="submit" className="w-full sm:w-auto">
                          <Settings className="mr-2 h-4 w-4" />
                          {t.profile?.manageSubscription || 'Manage Subscription'}
                        </Button>
                      </form>
                    </div>
                  ) : profileData.subscriptionData.subscription_status === 'free' ? (
                    <div className="pt-4">
                      <Button asChild className="w-full sm:w-auto">
                        <a href="/pricing">
                          {t.profile?.upgradeToPro || 'Upgrade to Plus'}
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">{t.profile?.noSubscription || 'No active subscription'}</p>
                  <Button asChild>
                    <a href="/pricing">{t.profile?.viewPricing || 'View Pricing Plans'}</a>
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

