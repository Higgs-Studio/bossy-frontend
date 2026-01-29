'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTranslation } from '@/contexts/translation-context';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Bossy" 
            width={200} 
            height={75}
            className="h-16 w-auto"
            priority
          />
        </div>
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          {mode === 'signin'
            ? (t.auth?.signIn?.title || 'Welcome Back')
            : (t.auth?.signUp?.title || 'Hire Your AI Boss')}
        </h2>
        <p className="text-center text-sm sm:text-base text-slate-600 mb-8">
          {mode === 'signin'
            ? (t.auth?.signIn?.subtitle || 'Your AI accountability boss is waiting')
            : (t.auth?.signUp?.subtitle || 'Start your AI-powered accountability journey')}
        </p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6 sm:p-8">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                {t.auth?.email || 'Email'}
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  required
                  maxLength={50}
                  placeholder={t.auth?.enterEmail || 'Enter your email'}
                  className="border-slate-300"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                {t.auth?.password || 'Password'}
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === 'signin' ? 'current-password' : 'new-password'
                  }
                  defaultValue={state.password}
                  required
                  minLength={8}
                  maxLength={100}
                  placeholder={t.auth?.enterPassword || 'Enter your password'}
                  className="border-slate-300"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-red-700 text-sm bg-red-50 p-4 rounded-lg border border-red-200 font-medium">
                {state.error}
              </div>
            )}
            {state?.success && (
              <div className="text-green-700 text-sm bg-green-50 p-4 rounded-lg border border-green-200 font-medium">
                {state.success}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                size="lg"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    {t.nav?.loading || 'Loading...'}
                  </>
                ) : mode === 'signin' ? (
                  t.common?.signIn || 'Sign in'
                ) : (
                  t.common?.signUp || 'Sign up'
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-50 text-slate-500">
                {mode === 'signin'
                  ? (t.auth?.newToPlatform || 'New to Bossy?')
                  : (t.auth?.alreadyHaveAccount || 'Already have an account?')}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${redirect ? `?redirect=${redirect}` : ''
                }${priceId ? `&priceId=${priceId}` : ''}`}
              className="w-full flex justify-center py-3 px-4 border-2 border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {mode === 'signin'
                ? (t.auth?.createAccount || 'Create an account')
                : (t.auth?.signInExisting || 'Sign in to existing account')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
