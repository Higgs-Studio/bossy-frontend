'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, CreditCard, Settings, ExternalLink } from 'lucide-react';
import { manageSubscriptionAction } from './actions';
import { ProfileSettings } from './profile-settings';
import { PersonalInfo } from './personal-info';
import { useTranslation } from '@/contexts/translation-context';
import { useEffect, useState } from 'react';
import { getProfileData } from './actions';
import { useSearchParams } from 'next/navigation';
import { formatTemplate } from '@/lib/i18n/format';

export default function ProfilePage() {
  const { t, locale } = useTranslation();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Refresh data when component mounts or when returning from Stripe
    const loadData = async () => {
      setLoading(true);
      const data = await getProfileData();
      setProfileData(data);
      setLoading(false);
    };

    loadData();

    // Check if we're returning from Stripe portal
    const returnedFromStripe = searchParams.get('from') === 'stripe';
    if (returnedFromStripe) {
      // Clear the URL parameter
      window.history.replaceState({}, '', '/app/profile');
      
      // Set up a delayed refresh to allow webhook processing
      const timer = setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">{t.nav.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {t.profile.title}
          </h1>
          <p className="text-muted-foreground text-lg">{t.profile.subtitle}</p>
        </div>

        {/* Account Information */}
        <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t.profile.accountInfo}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.profile.email}</label>
                <p className="text-base text-foreground mt-1">{profileData?.user?.email || t.profile.notSet}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.profile.userId}</label>
                <p className="text-base text-foreground mt-1 font-mono text-sm">{profileData?.user?.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.profile.accountCreated}</label>
                <p className="text-base text-foreground mt-1">
                  {profileData?.user?.created_at
                    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(profileData.user.created_at))
                    : t.profile.unknown}
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
              <CardTitle>{t.profile.subscription}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileData?.subscriptionData ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t.profile.status}</label>
                    <p className="text-base text-foreground mt-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          profileData.subscriptionData.subscription_status === 'active' ||
                          profileData.subscriptionData.subscription_status === 'trialing'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                            : profileData.subscriptionData.subscription_status === 'canceling'
                            ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20'
                            : profileData.subscriptionData.subscription_status === 'free'
                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-muted text-foreground border border-border'
                        }`}
                      >
                        {t.profile.subscriptionStatus[
                          profileData.subscriptionData.subscription_status as keyof typeof t.profile.subscriptionStatus
                        ] ?? profileData.subscriptionData.subscription_status}
                      </span>
                    </p>
                    {profileData.subscriptionData.subscription_status === 'canceling' && 
                     profileData.subscriptionData.subscription_end_date && (
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                        {t.profile.accessUntil}{' '}
                        {new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(profileData.subscriptionData.subscription_end_date))}
                      </p>
                    )}
                  </div>
                  {profileData.subscriptionData.plan_name && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">{t.profile.plan}</label>
                      <p className="text-base text-foreground mt-1">
                        {profileData.subscriptionData.plan_name === 'Free'
                          ? t.common.free
                          : profileData.subscriptionData.plan_name === 'Plus'
                            ? t.common.plus
                            : profileData.subscriptionData.plan_name}
                        {profileData.subscriptionData.billing_interval && (
                          <span className="text-sm text-muted-foreground ml-2">
                            {formatTemplate(t.profile.billed, {
                              interval:
                                profileData.subscriptionData.billing_interval === 'year'
                                  ? t.profile.billingInterval.yearly
                                  : t.profile.billingInterval.monthly,
                            })}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {profileData.subscriptionData.stripe_customer_id && 
                   (profileData.subscriptionData.subscription_status === 'active' || 
                    profileData.subscriptionData.subscription_status === 'canceling' ||
                    profileData.subscriptionData.subscription_status === 'trialing') ? (
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <form action={manageSubscriptionAction}>
                        <Button type="submit" className="w-full sm:w-auto">
                          <Settings className="mr-2 h-4 w-4" />
                          {profileData.subscriptionData.subscription_status === 'canceling'
                            ? t.profile.reactivateSubscription
                            : t.profile.manageSubscription}
                        </Button>
                      </form>
                      <Button asChild variant="outline" className="w-full sm:w-auto">
                        <a href="/app/pricing">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {t.profile.viewPricing}
                        </a>
                      </Button>
                    </div>
                  ) : profileData.subscriptionData.subscription_status === 'free' ? (
                    <div className="pt-4">
                      <Button asChild className="w-full sm:w-auto">
                        <a href="/pricing">
                          {t.profile.upgradeToPro}
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">{t.profile.noSubscription}</p>
                  <Button asChild>
                    <a href="/pricing">{t.profile.viewPricing}</a>
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

