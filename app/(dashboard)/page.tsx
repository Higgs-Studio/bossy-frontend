'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock, TrendingUp, Shield, Zap, BarChart3, Users, Award, MessageSquare, Target, Smile } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTranslation } from '@/contexts/translation-context';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-24 xl:py-32 overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-white dark:from-slate-950 dark:via-indigo-950/30 dark:to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800 rounded-full mb-6">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">{t.hero?.badge || 'AI-Powered Accountability Boss'}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              {t.hero?.title || 'Hire Your Personal'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mt-2">{t.hero?.titleHighlight || 'AI Accountability Boss'}</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-3xl mx-auto">
              {t.hero?.subtitle || 'Stop setting goals you never complete. Your AI boss holds you accountable every single day.'}
            </p>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.hero?.freeToStart || 'Free to start'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.hero?.noCreditCard || 'No credit card'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.hero?.cancelAnytime || 'Cancel anytime'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t.stats?.title || 'Your AI Boss Never Sleeps'}</h2>
            <p className="text-sm sm:text-base text-indigo-200 dark:text-indigo-300">{t.stats?.subtitle || 'Consistent accountability, 24/7 tracking, zero tolerance for excuses'}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">98%</div>
              <div className="text-sm sm:text-base text-slate-300 dark:text-slate-400">{t.stats?.completionRate || 'Completion Rate'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">10K+</div>
              <div className="text-sm sm:text-base text-slate-300 dark:text-slate-400">{t.stats?.usersAccountable || 'Users Accountable'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">50K+</div>
              <div className="text-sm sm:text-base text-slate-300 dark:text-slate-400">{t.stats?.goalsCompleted || 'Goals Completed'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">24/7</div>
              <div className="text-sm sm:text-base text-slate-300 dark:text-slate-400">{t.stats?.aiMonitoring || 'AI Monitoring'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your AI Boss - Brief Intro */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-full mb-6">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">⚡ AI-Powered Accountability</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Meet Your AI Accountability Boss
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Unlike traditional goal tracking apps, Bossy gives you a direct, no-nonsense AI boss who monitors your progress and holds you accountable every single day.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Real-Time Feedback</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your AI boss responds instantly to every check-in with personalized feedback</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">No Negotiations</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Commitments are final. Your AI boss doesn't accept excuses—only results</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Pattern Recognition</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">AI tracks your consistency and escalates feedback when you fall off track</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">24/7 Availability</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Access your boss anytime via WhatsApp or the dashboard for instant accountability</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Chat with AI Boss Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full mb-6">
              <span className="text-sm font-semibold text-green-300">💬 WhatsApp Integration</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Chat with Your AI Boss
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-2">Anytime, Anywhere</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Your AI boss is always available on WhatsApp. Get real-time accountability, motivation, and guidance directly on your phone.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - WhatsApp Chat Mockup */}
            <div className="relative">
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-green-400/30 rounded-3xl overflow-hidden shadow-2xl">
                {/* WhatsApp Header */}
                <div className="bg-green-600 px-6 py-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">The Execution Boss</h3>
                    <p className="text-green-100 text-sm">Active now</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="bg-[#0a1f1c] p-6 space-y-4 min-h-[500px]">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">Hey boss! I just completed today's task - 90 minutes of focused work on my MVP! 🎉</p>
                      <p className="text-green-200 text-xs mt-1">10:32 AM</p>
                    </div>
                  </div>

                  {/* Boss response */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 max-w-[80%] border border-slate-700">
                      <p className="text-white text-sm font-medium">Good. You did what you said you'd do. That's 3 days straight now.</p>
                      <p className="text-slate-400 text-xs mt-1">10:32 AM</p>
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">Feeling great! What should I focus on tomorrow?</p>
                      <p className="text-green-200 text-xs mt-1">10:33 AM</p>
                    </div>
                  </div>

                  {/* Boss response */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 max-w-[80%] border border-slate-700">
                      <p className="text-white text-sm font-medium">Tomorrow is the same: Work 90 minutes on: Launch my SaaS MVP</p>
                      <p className="text-slate-400 text-sm mt-2">You're building momentum. Don't break the streak. Show up tomorrow like you did today.</p>
                      <p className="text-slate-400 text-xs mt-1">10:33 AM</p>
                    </div>
                  </div>

                  {/* User message - procrastination */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">I'm feeling tired today... maybe I should rest?</p>
                      <p className="text-green-200 text-xs mt-1">2 days later, 11:15 AM</p>
                    </div>
                  </div>

                  {/* Boss response - accountability */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 max-w-[80%] border border-red-500/50">
                      <p className="text-white text-sm font-bold">No. You've already missed yesterday.</p>
                      <p className="text-red-300 text-sm mt-2">You have 2 overdue tasks piling up. "Tired" is not an excuse. Either do the work or quit the goal. Which is it?</p>
                      <p className="text-slate-400 text-xs mt-1">11:15 AM</p>
                    </div>
                  </div>

                  {/* User message - commitment */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">You're right. I'll do it now. Just finished! ✅</p>
                      <p className="text-green-200 text-xs mt-1">2:45 PM</p>
                    </div>
                  </div>

                  {/* Boss response - positive */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 max-w-[80%] border border-green-500/50">
                      <p className="text-white text-sm font-medium">That's better. You just saved your streak.</p>
                      <p className="text-green-300 text-sm mt-2">Remember this moment next time you want to quit. You're capable of pushing through. Prove it again tomorrow.</p>
                      <p className="text-slate-400 text-xs mt-1">2:45 PM</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Input (Inactive) */}
                <div className="bg-slate-900 px-4 py-3 border-t border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-800 rounded-full px-4 py-2">
                      <p className="text-slate-500 text-sm">Message your boss...</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="text-white space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-4">Your Boss in Your Pocket</h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Connect with your AI accountability boss directly through WhatsApp. No app switching required.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Instant Accountability</h4>
                    <p className="text-slate-400">Get immediate feedback on your progress. Your boss responds in real-time to keep you on track.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">No-Nonsense Approach</h4>
                    <p className="text-slate-400">Your boss doesn't sugarcoat. When you're slipping, you'll know it. When you're crushing it, you'll be acknowledged.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Always Available</h4>
                    <p className="text-slate-400">24/7 access to accountability. Update your progress, ask for guidance, or get a reality check anytime.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Goal-Focused Conversations</h4>
                    <p className="text-slate-400">Every conversation is about your goals and progress. No distractions, just results-driven dialogue.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 h-auto text-lg shadow-lg shadow-green-500/30" asChild>
                  <Link href="/sign-up">
                    Start Chatting with Your Boss
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard & Goals Overview Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-full mb-6">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">📊 Your Command Center</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t.preview?.seeItInAction || 'Everything You Need at a Glance'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              A clean, powerful dashboard that shows your goals, tasks, and progress with crystal-clear accountability
            </p>
          </div>

          {/* Dashboard Preview Card */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Your Dashboard</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Boss Feedback Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                      <Smile className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-2">
                        Boss Feedback
                      </span>
                      <p className="text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                        "Good. You're staying on track. Don't let up."
                      </p>
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">0</div>
                      <div className="text-xs font-semibold text-green-700 dark:text-green-500">Overdue Tasks</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">2</div>
                      <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-500">Today's Tasks</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task List Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Outstanding Tasks for Today</h4>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    2 outstanding
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500 text-white">
                            TODAY
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                            PENDING
                          </span>
                        </div>
                        <p className="text-base text-slate-900 dark:text-white font-medium leading-relaxed">
                          Work 90 minutes on: Launch my SaaS MVP
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                        Done
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500 text-white">
                            TODAY
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                            PENDING
                          </span>
                        </div>
                        <p className="text-base text-slate-900 dark:text-white font-medium leading-relaxed">
                          Review user feedback and prioritize features
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals Overview Card */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-purple-600 dark:bg-purple-500 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Your Goals</h3>
              </div>
              
              {/* Active Goal Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Active Goal</h4>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    In Progress
                  </span>
                </div>
                <h5 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Launch my SaaS MVP</h5>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">Intensity:</span>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                      High
                    </span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span>Dec 1, 2024 - Jan 29, 2025</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Goal Progress</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 dark:text-white font-bold text-lg">67%</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">Complete</span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: '67%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Started Dec 1</span>
                    <span>Ends Jan 29</span>
                  </div>
                </div>
              </div>

              {/* Multiple Goals Info */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">Pro tip:</span> Track multiple goals simultaneously with paid plans
                </p>
              </div>
            </div>
          </div>

          {/* How It Works in Practice */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">Set Clear Goals</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Define time-bound goals with custom intensity levels. Choose 14, 30, or 60-day commitments and specify exactly what you'll work on daily.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">Track Daily Progress</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Check in every day with simple task completion. See your overdue and pending tasks at a glance, and build consistency with clear metrics.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">Get Real Feedback</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your AI boss monitors your performance and provides direct feedback. Stay accountable through WhatsApp or the dashboard interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t.features?.title || 'Everything You Need to Stay Accountable'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t.features?.subtitle || 'Powerful features designed to help you build consistency and achieve your goals'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features?.goalSetting?.title || 'Goal Setting'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features?.goalSetting?.description || 'Define clear, time-bound goals with custom intensity levels. Once set, commit fully—no editing, no backing out.'}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features?.dailyCheckins?.title || 'Daily Check-ins'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features?.dailyCheckins?.description || 'Track your progress every single day. Build momentum with consistent check-ins and see your streak grow.'}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features?.aiBoss?.title || 'AI Boss'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features?.aiBoss?.description || "Your AI accountability boss monitors your progress 24/7. Miss a day? You'll hear about it. Stay consistent? You'll be acknowledged."}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features?.progressTracking?.title || 'Progress Tracking'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features?.progressTracking?.description || "Visualize your journey with detailed progress tracking. See how far you've come and stay motivated."}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features?.streakBuilding?.title || 'Streak Building'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features?.streakBuilding?.description || 'Build powerful habits through consistent daily action. Watch your streak counter climb higher every day.'}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features?.achievements?.title || 'Achievement System'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features?.achievements?.description || 'Earn recognition for hitting milestones. Celebrate your wins and stay motivated on your journey.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t.howItWorks?.title || 'Simple Process, Powerful Results'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t.howItWorks?.subtitle || 'Get started in minutes and build the consistency habit that transforms lives'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200 dark:from-indigo-900 dark:via-indigo-700 dark:to-indigo-900 -z-10"></div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">
                {t.howItWorks?.step1?.title || 'Set Your Goal'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                {t.howItWorks?.step1?.description || 'Define what you want to achieve, choose your timeline (14, 30, or 60 days), and select your intensity level. Make it specific and meaningful.'}
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">
                {t.howItWorks?.step2?.title || 'Daily Check-ins'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                {t.howItWorks?.step2?.description || 'Every day, log in and mark your progress. Did you do the work? Be honest with yourself. The system tracks everything.'}
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">
                {t.howItWorks?.step3?.title || 'Build Momentum'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                {t.howItWorks?.step3?.description || 'Watch your streak grow, receive feedback from your accountability partner, and experience the compound effect of daily consistency.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t.testimonials?.title || 'Trusted by Achievers'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t.testimonials?.subtitle || 'See what our users are saying about their transformation'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                "Bossy completely changed how I approach my goals. The daily accountability kept me on track when I would have normally given up."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Sarah Johnson</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Entrepreneur</div>
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                "I've tried every productivity app out there. Bossy is different—it actually makes you accountable. No more empty promises to myself."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Michael Chen</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Product Manager</div>
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                "The no-excuses approach is exactly what I needed. I've completed 3 major goals this year thanks to Bossy's accountability system."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">EP</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Emily Parker</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
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
            <span className="text-white dark:text-slate-100 font-semibold">{t.cta?.badge || 'Your AI Boss is Ready'}</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white dark:text-slate-100 mb-6">
            {t.cta?.title || 'Ready to Hire Your'}
            <span className="block mt-2">{t.cta?.titleLine2 || 'AI Accountability Boss?'}</span>
          </h2>
          <p className="text-xl text-indigo-100 dark:text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
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
          <p className="mt-8 text-indigo-200 dark:text-indigo-300 text-sm">
            {t.cta?.features || 'Free to start • No credit card required • Your AI boss is ready 24/7'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/#features" className="hover:text-white dark:hover:text-slate-100 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white dark:hover:text-slate-100 transition-colors">Pricing</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-white dark:hover:text-slate-100 transition-colors">How It Works</Link></li>
                <li><Link href="/sign-up" className="hover:text-white dark:hover:text-slate-100 transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="hover:text-white dark:hover:text-slate-100 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white dark:hover:text-slate-100 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><span className="text-slate-400 dark:text-slate-500">Bossy</span></li>
                <li><span className="text-slate-400 dark:text-slate-500 text-sm">Execution-First Accountability</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 dark:text-slate-500 text-sm">
              © {new Date().getFullYear()} Bossy. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <ThemeSwitcher className="text-slate-300 dark:text-slate-400 hover:text-white dark:hover:text-slate-200" />
              <LanguageSwitcher />
              <Link href="/privacy" className="text-sm hover:text-white dark:hover:text-slate-100 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm hover:text-white dark:hover:text-slate-100 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
