'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock, TrendingUp, Shield, Zap, BarChart3, Users, Award, MessageSquare, Target, Smile } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTranslation } from '@/contexts/translation-context';
import { formatTemplate } from '@/lib/i18n/format';

export default function HomePage() {
  const { t, locale } = useTranslation();

  const sampleStartDate = new Date(2024, 11, 1);
  const sampleEndDate = new Date(2025, 0, 29);
  const sampleRange = `${new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(sampleStartDate)} - ${new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(sampleEndDate)}`;
  const sampleShortDate = (d: Date) => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(d);

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
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">{t.hero.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
              {t.hero.title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mt-2">{t.hero.titleHighlight}</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-3xl mx-auto">
              {t.hero.subtitle}
            </p>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="text-base px-8 py-6 h-auto"
                asChild
              >
                <Link href="/sign-up">
                  {t.hero.cta}
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
                  {t.hero.secondaryCta}
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.hero.freeToStart}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.hero.noCreditCard}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.hero.cancelAnytime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t.stats.title}</h2>
            <p className="text-sm sm:text-base text-indigo-200 dark:text-indigo-300">{t.stats.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">98%</div>
              <div className="text-sm sm:text-base text-slate-300 dark:text-slate-400">{t.stats.completionRate}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">10K+</div>
              <div className="text-sm sm:text-base text-slate-300 dark:text-slate-400">{t.stats.usersAccountable}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">50K+</div>
              <div className="text-sm sm:text-base text-slate-300 dark:text-slate-400">{t.stats.goalsCompleted}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">24/7</div>
              <div className="text-sm sm:text-base text-slate-300 dark:text-slate-400">{t.stats.aiMonitoring}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your AI Boss - Brief Intro */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-full mb-6">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{t.bossSection.introBadge}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t.bossSection.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {t.bossSection.titleHighlight}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              {t.bossSection.description}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t.bossSection.features.realtime.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.bossSection.features.realtime.description}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t.bossSection.features.noNegotiations.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.bossSection.features.noNegotiations.description}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t.bossSection.features.pattern.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.bossSection.features.pattern.description}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t.bossSection.features.availability.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.bossSection.features.availability.description}</p>
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
              <span className="text-sm font-semibold text-green-300">{t.whatsapp.landing.badge}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {t.whatsapp.landing.title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-2">{t.whatsapp.landing.titleHighlight}</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t.whatsapp.landing.subtitle}
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
                    <h3 className="text-white font-bold text-lg">{t.whatsapp.landing.chatHeaderTitle}</h3>
                    <p className="text-green-100 text-sm">{t.whatsapp.landing.chatHeaderStatus}</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="bg-[#0a1f1c] p-6 space-y-4 min-h-[500px]">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">{t.whatsapp.landing.messages.user1}</p>
                      <p className="text-green-200 text-xs mt-1">{t.whatsapp.landing.messages.time1}</p>
                    </div>
                  </div>

                  {/* Boss response */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 max-w-[80%] border border-slate-700">
                      <p className="text-white text-sm font-medium">{t.whatsapp.landing.messages.boss1}</p>
                      <p className="text-slate-400 text-xs mt-1">{t.whatsapp.landing.messages.time1}</p>
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">{t.whatsapp.landing.messages.user2}</p>
                      <p className="text-green-200 text-xs mt-1">{t.whatsapp.landing.messages.time2}</p>
                    </div>
                  </div>

                  {/* Boss response */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 max-w-[80%] border border-slate-700">
                      <p className="text-white text-sm font-medium">{t.whatsapp.landing.messages.boss2Line1}</p>
                      <p className="text-slate-400 text-sm mt-2">{t.whatsapp.landing.messages.boss2Line2}</p>
                      <p className="text-slate-400 text-xs mt-1">{t.whatsapp.landing.messages.time2}</p>
                    </div>
                  </div>

                  {/* User message - procrastination */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">{t.whatsapp.landing.messages.user3}</p>
                      <p className="text-green-200 text-xs mt-1">{t.whatsapp.landing.messages.time3}</p>
                    </div>
                  </div>

                  {/* Boss response - accountability */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 max-w-[80%] border border-red-500/50">
                      <p className="text-white text-sm font-bold">{t.whatsapp.landing.messages.boss3Line1}</p>
                      <p className="text-red-300 text-sm mt-2">{t.whatsapp.landing.messages.boss3Line2}</p>
                      <p className="text-slate-400 text-xs mt-1">{t.whatsapp.landing.messages.time3}</p>
                    </div>
                  </div>

                  {/* User message - commitment */}
                  <div className="flex justify-end">
                    <div className="bg-green-600 rounded-lg px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">{t.whatsapp.landing.messages.user4}</p>
                      <p className="text-green-200 text-xs mt-1">{t.whatsapp.landing.messages.time4}</p>
                    </div>
                  </div>

                  {/* Boss response - positive */}
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 max-w-[80%] border border-green-500/50">
                      <p className="text-white text-sm font-medium">{t.whatsapp.landing.messages.boss4Line1}</p>
                      <p className="text-green-300 text-sm mt-2">{t.whatsapp.landing.messages.boss4Line2}</p>
                      <p className="text-slate-400 text-xs mt-1">{t.whatsapp.landing.messages.time4}</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Input (Inactive) */}
                <div className="bg-slate-900 px-4 py-3 border-t border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-800 rounded-full px-4 py-2">
                      <p className="text-slate-500 text-sm">{t.whatsapp.landing.inputPlaceholder}</p>
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
                <h3 className="text-3xl font-bold mb-4">{t.whatsapp.landing.right.title}</h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {t.whatsapp.landing.right.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{t.whatsapp.landing.right.features[0].title}</h4>
                    <p className="text-slate-400">{t.whatsapp.landing.right.features[0].description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{t.whatsapp.landing.right.features[1].title}</h4>
                    <p className="text-slate-400">{t.whatsapp.landing.right.features[1].description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{t.whatsapp.landing.right.features[2].title}</h4>
                    <p className="text-slate-400">{t.whatsapp.landing.right.features[2].description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{t.whatsapp.landing.right.features[3].title}</h4>
                    <p className="text-slate-400">{t.whatsapp.landing.right.features[3].description}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 h-auto text-lg shadow-lg shadow-green-500/30" asChild>
                  <Link href="/sign-up">
                    {t.whatsapp.landing.right.cta}
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
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{t.preview.commandCenterBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t.preview.sectionTitle}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t.preview.description}
            </p>
          </div>

          {/* Dashboard Preview Card */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t.preview.dashboard}</h3>
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
                        {t.dashboard.bossFeedback}
                      </span>
                      <p className="text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                        {t.preview.bossFeedbackExample}
                      </p>
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">0</div>
                      <div className="text-xs font-semibold text-green-700 dark:text-green-500">{t.dashboard.overdueTasks}</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">2</div>
                      <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-500">{t.dashboard.todaysTasks}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task List Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{t.dashboard.outstandingTasks}</h4>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    2 {t.dashboard.outstanding}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500 text-white uppercase">
                            {t.dashboard.badges.today}
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                            {t.dashboard.badges.pending}
                          </span>
                        </div>
                        <p className="text-base text-slate-900 dark:text-white font-medium leading-relaxed">
                          {t.preview.workMinutes} {t.preview.sampleGoalTitle}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                        {t.preview.markDone}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500 text-white uppercase">
                            {t.dashboard.badges.today}
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                            {t.dashboard.badges.pending}
                          </span>
                        </div>
                        <p className="text-base text-slate-900 dark:text-white font-medium leading-relaxed">
                          {t.preview.sampleTask2}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                        {t.preview.markDone}
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t.goals.title}</h3>
              </div>
              
              {/* Active Goal Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{t.preview.activeGoal}</h4>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    {t.preview.inProgress}
                  </span>
                </div>
                <h5 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t.preview.sampleGoalTitle}</h5>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t.preview.intensity}:</span>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                      {t.preview.high}
                    </span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span>{sampleRange}</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t.preview.goalProgress}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 dark:text-white font-bold text-lg">67%</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{t.preview.complete}</span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: '67%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{t.preview.started} {sampleShortDate(sampleStartDate)}</span>
                    <span>{t.preview.ends} {sampleShortDate(sampleEndDate)}</span>
                  </div>
                </div>
              </div>

              {/* Multiple Goals Info */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{t.preview.proTipLabel}</span> {t.preview.proTipText}
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
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">{t.howItWorks.step1.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.howItWorks.step1.description}
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">{t.howItWorks.step2.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.howItWorks.step2.description}
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">{t.howItWorks.step3.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.howItWorks.step3.description}
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
              {t.features.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features.goalSetting.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.goalSetting.description}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features.dailyCheckins.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.dailyCheckins.description}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features.aiBoss.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.aiBoss.description}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features.progressTracking.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.progressTracking.description}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features.streakBuilding.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.streakBuilding.description}
              </p>
            </div>

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t.features.achievements.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.achievements.description}
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
              {t.howItWorks.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t.howItWorks.subtitle}
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
                {t.howItWorks.step1.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                {t.howItWorks.step1.description}
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">
                {t.howItWorks.step2.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                {t.howItWorks.step2.description}
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">
                {t.howItWorks.step3.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                {t.howItWorks.step3.description}
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
              {t.testimonials.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t.testimonials.subtitle}
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
                {t.testimonials.items[0].quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{t.testimonials.items[0].initials}</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{t.testimonials.items[0].name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{t.testimonials.items[0].role}</div>
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
                {t.testimonials.items[1].quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{t.testimonials.items[1].initials}</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{t.testimonials.items[1].name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{t.testimonials.items[1].role}</div>
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
                {t.testimonials.items[2].quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{t.testimonials.items[2].initials}</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{t.testimonials.items[2].name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{t.testimonials.items[2].role}</div>
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
            <span className="text-white dark:text-slate-100 font-semibold">{t.cta.badge}</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white dark:text-slate-100 mb-6">
            {t.cta.title}
            <span className="block mt-2">{t.cta.titleLine2}</span>
          </h2>
          <p className="text-xl text-indigo-100 dark:text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 text-base px-8 py-6 h-auto font-semibold shadow-2xl hover:shadow-3xl transition-all duration-200"
              asChild
            >
              <Link href="/sign-up">
                {t.cta.button}
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
                {t.cta.secondaryButton}
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-indigo-200 dark:text-indigo-300 text-sm">
            {t.cta.features}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">{t.footer.product}</h3>
              <ul className="space-y-3">
                <li><Link href="/#features" className="hover:text-white dark:hover:text-slate-100 transition-colors">{t.common.features}</Link></li>
                <li><Link href="/pricing" className="hover:text-white dark:hover:text-slate-100 transition-colors">{t.common.pricing}</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-white dark:hover:text-slate-100 transition-colors">{t.common.howItWorks}</Link></li>
                <li><Link href="/sign-up" className="hover:text-white dark:hover:text-slate-100 transition-colors">{t.common.getStarted}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">{t.footer.legal}</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="hover:text-white dark:hover:text-slate-100 transition-colors">{t.legal.privacyPolicy}</Link></li>
                <li><Link href="/terms" className="hover:text-white dark:hover:text-slate-100 transition-colors">{t.legal.termsOfService}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white dark:text-slate-200 font-semibold mb-4">{t.footer.company}</h3>
              <ul className="space-y-3">
                <li><span className="text-slate-400 dark:text-slate-500">{t.common.appName}</span></li>
                <li><span className="text-slate-400 dark:text-slate-500 text-sm">{t.footer.tagline}</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 dark:text-slate-500 text-sm">
              {formatTemplate(t.footer.copyright, { year: new Date().getFullYear(), appName: t.common.appName })}
            </div>
            <div className="flex items-center gap-6">
              <ThemeSwitcher className="text-slate-300 dark:text-slate-400 hover:text-white dark:hover:text-slate-200" />
              <LanguageSwitcher />
              <Link href="/privacy" className="text-sm hover:text-white dark:hover:text-slate-100 transition-colors">{t.legal.privacy}</Link>
              <Link href="/terms" className="text-sm hover:text-white dark:hover:text-slate-100 transition-colors">{t.legal.terms}</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
