'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock, TrendingUp, Shield, Zap, BarChart3, Users, Award, MessageSquare, Target } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/contexts/translation-context';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full mb-6">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t.hero?.badge || 'AI-Powered Accountability Boss'}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
              {t.hero?.title || 'Hire Your Personal'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">{t.hero?.titleHighlight || 'AI Accountability Boss'}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-6 leading-relaxed max-w-3xl mx-auto">
              {t.hero?.subtitle || 'Stop setting goals you never complete. Your AI boss holds you accountable every single day.'}
            </p>
            <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
              {t.hero?.description || 'No negotiations. No excuses. Just consistent daily action and real results.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="text-base px-8 py-6 h-auto"
                asChild
              >
                <Link href="/sign-up">
                  {t.hero?.cta || 'Start Free Today'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 h-auto border-slate-300"
                asChild
              >
                <Link href="#how-it-works">
                  {t.hero?.secondaryCta || 'See How It Works'}
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                <span>{t.hero?.freeToStart || 'Free to start'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                <span>{t.hero?.noCreditCard || 'No credit card'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                <span>{t.hero?.cancelAnytime || 'Cancel anytime'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">{t.stats?.title || 'Your AI Boss Never Sleeps'}</h2>
            <p className="text-indigo-200">{t.stats?.subtitle || 'Consistent accountability, 24/7 tracking, zero tolerance for excuses'}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">98%</div>
              <div className="text-slate-300">{t.stats?.completionRate || 'Completion Rate'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">10K+</div>
              <div className="text-slate-300">{t.stats?.usersAccountable || 'Users Accountable'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">50K+</div>
              <div className="text-slate-300">{t.stats?.goalsCompleted || 'Goals Completed'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">24/7</div>
              <div className="text-slate-300">{t.stats?.aiMonitoring || 'AI Monitoring'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your AI Boss Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - AI Boss Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-400/30 rounded-3xl p-8 lg:p-12">
                {/* AI Boss Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                      ONLINE
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">The Execution Boss</h3>
                    <p className="text-indigo-300 text-sm">Your AI Accountability Partner</p>
                  </div>
                </div>

                {/* Boss Messages */}
                <div className="space-y-4">
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-indigo-400/20 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">
                      "Good. You did what you said you'd do. Keep it up."
                    </p>
                    <div className="flex items-center gap-2 text-xs text-indigo-300">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span>Sent today at 9:00 PM</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-sm border border-red-400/20 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">
                      "You missed today. No excuses. Get back on track tomorrow."
                    </p>
                    <div className="flex items-center gap-2 text-xs text-red-300">
                      <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                      <span>Warning message</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-sm border border-indigo-400/20 rounded-xl p-4">
                    <p className="text-white font-medium mb-2">
                      "Three days straight. Now you're building something real."
                    </p>
                    <div className="flex items-center gap-2 text-xs text-indigo-300">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span>Achievement unlocked</span>
                    </div>
                  </div>
                </div>

                {/* AI Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-indigo-300 text-sm">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="font-semibold">Powered by AI • Active 24/7</span>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="text-white">
              <div className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full mb-6">
                <span className="text-sm font-semibold text-indigo-300">⚡ {t.bossSection?.badge || 'AI-Powered'}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                {t.bossSection?.title || 'Meet Your'}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{t.bossSection?.titleHighlight || 'AI Accountability Boss'}</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {t.bossSection?.description || 'Unlike traditional goal tracking apps, Bossy gives you a direct, no-nonsense AI boss who monitors your progress and holds you accountable every single day.'}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{t.bossSection?.features?.realtime?.title || 'Real-Time Feedback'}</h4>
                    <p className="text-slate-400">{t.bossSection?.features?.realtime?.description || 'Your AI boss responds instantly to every check-in with personalized feedback'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{t.bossSection?.features?.noNegotiations?.title || 'No Negotiations'}</h4>
                    <p className="text-slate-400">{t.bossSection?.features?.noNegotiations?.description || "Commitments are final. Your AI boss doesn't accept excuses—only results"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{t.bossSection?.features?.pattern?.title || 'Pattern Recognition'}</h4>
                    <p className="text-slate-400">{t.bossSection?.features?.pattern?.description || 'AI tracks your consistency and escalates feedback when you fall off track'}</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-6 h-auto text-lg shadow-lg shadow-indigo-500/30" asChild>
                <Link href="/sign-up">
                  {t.bossSection?.cta || 'Hire Your AI Boss Now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              {t.preview?.seeItInAction || 'See It In Action'}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the power of daily accountability with a clean, focused interface designed to keep you on track
            </p>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border-8 border-slate-200 shadow-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white">
              {/* Mock Browser Header */}
              <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block bg-slate-700 rounded px-3 py-1">
                    <span className="text-xs text-slate-300">bossy.app/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Mock Dashboard Content */}
              <div className="p-8 lg:p-12">
                <div className="space-y-6">
                  {/* Mock Header */}
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.preview?.dashboard || 'Dashboard'}</h2>
                    <p className="text-slate-600">Monday, December 30, 2024</p>
                  </div>

                  {/* Mock Goal Card */}
                  <div className="border-2 border-indigo-200 rounded-xl p-6 bg-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">{t.preview?.activeGoal || 'Active Goal'}</h3>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        {t.preview?.inProgress || 'In Progress'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-3">Launch my SaaS MVP</h4>
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">{t.preview?.intensity || 'Intensity'}:</span>
                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                          {t.preview?.high || 'High'}
                        </span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>Dec 1, 2024 - Jan 29, 2025</span>
                      </div>
                    </div>
                    {/* Mock Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-slate-600 font-medium">{t.preview?.goalProgress || 'Goal Progress'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-bold text-lg">67%</span>
                          <span className="text-slate-500 text-xs">{t.preview?.complete || 'Complete'}</span>
                        </div>
                      </div>
                      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: '67%' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{t.preview?.started || 'Started'} Dec 1</span>
                        <span>{t.preview?.ends || 'Ends'} Jan 29</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Today's Task */}
                  <div className="border-2 border-slate-200 rounded-xl p-6 bg-white shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">{t.preview?.todaysTask || "Today's Task"}</h3>
                      <span className="text-xs text-slate-500">Dec 30, 2024</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                      <p className="text-base text-slate-800 leading-relaxed font-medium">
                        {t.preview?.workMinutes || 'Work 90 minutes on:'} Launch my SaaS MVP
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                        <Clock className="h-4 w-4 text-slate-600" />
                        <span className="text-slate-700 font-medium text-sm">{t.preview?.pending || 'Pending'}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                        {t.preview?.markDone || 'Mark Done'}
                      </button>
                    </div>
                  </div>

                  {/* Mock Boss Feedback */}
                  <div className="border-2 border-slate-200 rounded-xl p-6 bg-white shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">{t.preview?.activityHistory || 'Activity History'}</h3>
                      <span className="text-xs font-medium text-slate-600">{t.preview?.lastMessages || 'Last 3 messages'}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-base text-slate-800 leading-relaxed font-medium mb-2">
                          Good. You did what you said you'd do. Keep it up.
                        </p>
                        <p className="text-xs text-slate-500 font-medium">Friday, December 27, 2024</p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-base text-slate-800 leading-relaxed font-medium mb-2">
                          Three days straight. Now you're building something real.
                        </p>
                        <p className="text-xs text-slate-500 font-medium">Thursday, December 26, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights Below Mockup */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Clear Goals</h3>
              <p className="text-sm text-slate-600">Set time-bound goals with custom intensity levels</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Daily Check-ins</h3>
              <p className="text-sm text-slate-600">Track progress every day and build consistency</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Boss Feedback</h3>
              <p className="text-sm text-slate-600">Get real accountability with direct feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              {t.features?.title || 'Everything You Need to Stay Accountable'}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t.features?.subtitle || 'Powerful features designed to help you build consistency and achieve your goals'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {t.features?.goalSetting?.title || 'Goal Setting'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.features?.goalSetting?.description || 'Define clear, time-bound goals with custom intensity levels. Once set, commit fully—no editing, no backing out.'}
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {t.features?.dailyCheckins?.title || 'Daily Check-ins'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.features?.dailyCheckins?.description || 'Track your progress every single day. Build momentum with consistent check-ins and see your streak grow.'}
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {t.features?.aiBoss?.title || 'AI Boss'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.features?.aiBoss?.description || "Your AI accountability boss monitors your progress 24/7. Miss a day? You'll hear about it. Stay consistent? You'll be acknowledged."}
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {t.features?.progressTracking?.title || 'Progress Tracking'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.features?.progressTracking?.description || "Visualize your journey with detailed progress tracking. See how far you've come and stay motivated."}
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {t.features?.streakBuilding?.title || 'Streak Building'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.features?.streakBuilding?.description || 'Build powerful habits through consistent daily action. Watch your streak counter climb higher every day.'}
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {t.features?.achievements?.title || 'Achievement System'}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t.features?.achievements?.description || 'Earn recognition for hitting milestones. Celebrate your wins and stay motivated on your journey.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              {t.howItWorks?.title || 'Simple Process, Powerful Results'}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t.howItWorks?.subtitle || 'Get started in minutes and build the consistency habit that transforms lives'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200 -z-10"></div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                {t.howItWorks?.step1?.title || 'Set Your Goal'}
              </h3>
              <p className="text-slate-600 leading-relaxed text-center">
                {t.howItWorks?.step1?.description || 'Define what you want to achieve, choose your timeline (14, 30, or 60 days), and select your intensity level. Make it specific and meaningful.'}
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                {t.howItWorks?.step2?.title || 'Daily Check-ins'}
              </h3>
              <p className="text-slate-600 leading-relaxed text-center">
                {t.howItWorks?.step2?.description || 'Every day, log in and mark your progress. Did you do the work? Be honest with yourself. The system tracks everything.'}
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
                {t.howItWorks?.step3?.title || 'Build Momentum'}
              </h3>
              <p className="text-slate-600 leading-relaxed text-center">
                {t.howItWorks?.step3?.description || 'Watch your streak grow, receive feedback from your accountability partner, and experience the compound effect of daily consistency.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              {t.testimonials?.title || 'Trusted by Achievers'}
            </h2>
            <p className="text-lg text-slate-600">
              {t.testimonials?.subtitle || 'See what our users are saying about their transformation'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                "Bossy completely changed how I approach my goals. The daily accountability kept me on track when I would have normally given up."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Sarah Johnson</div>
                  <div className="text-sm text-slate-600">Entrepreneur</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                "I've tried every productivity app out there. Bossy is different—it actually makes you accountable. No more empty promises to myself."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Michael Chen</div>
                  <div className="text-sm text-slate-600">Product Manager</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                "The no-excuses approach is exactly what I needed. I've completed 3 major goals this year thanks to Bossy's accountability system."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">EP</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Emily Parker</div>
                  <div className="text-sm text-slate-600">Designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-6">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-white font-semibold">{t.cta?.badge || 'Your AI Boss is Ready'}</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t.cta?.title || 'Ready to Hire Your'}
            <span className="block mt-2">{t.cta?.titleLine2 || 'AI Accountability Boss?'}</span>
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.cta?.subtitle || "Join thousands of people who've stopped making excuses and started achieving their goals with AI-powered accountability."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 text-base px-8 py-6 h-auto font-semibold shadow-2xl hover:shadow-3xl transition-all duration-200"
              asChild
            >
              <Link href="/sign-up">
                {t.cta?.button || 'Start Free—Hire Your Boss'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-indigo-600 text-base px-8 py-6 h-auto font-semibold backdrop-blur-sm transition-all duration-200"
              asChild
            >
              <Link href="/pricing">
                {t.cta?.secondaryButton || 'View Pricing'}
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-indigo-200 text-sm">
            {t.cta?.features || 'Free to start • No credit card required • Your AI boss is ready 24/7'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/sign-up" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><span className="text-slate-400">Bossy</span></li>
                <li><span className="text-slate-400 text-sm">Execution-First Accountability</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Bossy. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
              <Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
