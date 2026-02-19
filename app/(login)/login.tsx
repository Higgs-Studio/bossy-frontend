'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useActionState, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { CircleIcon, Loader2 } from 'lucide-react';
import { sendOtp, verifyOtp } from './actions';
import { ActionState } from '@/lib/auth/middleware';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTranslation } from '@/contexts/translation-context';
import { formatTemplate } from '@/lib/i18n/format';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreeToDisclaimer, setAgreeToDisclaimer] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    otpSent ? verifyOtp : sendOtp,
    {}
  );

  // Watch for otpSent in state
  useEffect(() => {
    if (state?.otpSent && !otpSent) {
      setOtpSent(true);
      setResendCooldown(60); // 60 second cooldown
    }
  }, [state, otpSent]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    
    setIsResending(true);
    try {
      const formData = new FormData();
      formData.append('phone', `+${phoneNumber}`);
      if (mode === 'signup') {
        formData.append('mode', 'signup');
        formData.append('agreeToDisclaimer', 'true');
      }
      
      const result = await sendOtp({} as ActionState, formData);
      
      if (result && 'successCode' in result && result.successCode === 'otpSent') {
        setResendCooldown(60); // Reset cooldown
      }
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    } finally {
      setIsResending(false);
    }
  };

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
            alt={t.common.appName}
            width={200} 
            height={75}
            className="h-16 w-auto"
            priority
          />
        </div>
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          {mode === 'signin'
            ? t.auth.signIn.title
            : t.auth.signUp.title}
        </h2>
        <p className="text-center text-sm sm:text-base text-slate-600 mb-8">
          {mode === 'signin'
            ? t.auth.signIn.subtitle
            : t.auth.signUp.subtitle}
        </p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6 sm:p-8">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />
            {mode === 'signup' && <input type="hidden" name="mode" value="signup" />}
            {mode === 'signup' && agreeToDisclaimer && <input type="hidden" name="agreeToDisclaimer" value="true" />}
            
            {!otpSent ? (
              <div className="space-y-4">
                <PhoneInput
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                  label={t.auth.phone}
                  placeholder={t.auth.phonePlaceholder}
                  error={state?.errorCode === 'invalidPhone' ? t.auth.errors.invalidPhone : undefined}
                />
                <input type="hidden" name="phone" value={phoneNumber ? `+${phoneNumber}` : ''} />
                {mode === 'signup' && (
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agree-disclaimer"
                      name="agreeToDisclaimer"
                      value="true"
                      checked={agreeToDisclaimer}
                      onChange={(e) => setAgreeToDisclaimer(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label
                      htmlFor="agree-disclaimer"
                      className="text-sm text-slate-700 cursor-pointer leading-tight"
                    >
                      {t.auth.agreeToDisclaimerPrefix}
                      <Link
                        href="/disclaimer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-indigo-600 hover:text-indigo-700 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t.auth.agreeToDisclaimerLink}
                      </Link>
                      {t.auth.agreeToDisclaimerSuffix}
                    </Label>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <Label
                    htmlFor="phone-display"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {t.auth.phone}
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="phone-display"
                      type="tel"
                      value={state.phone || `+${phoneNumber}`}
                      readOnly
                      className="border-slate-300 bg-slate-50"
                    />
                    <input type="hidden" name="phone" value={state.phone || `+${phoneNumber}`} />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="otp"
                    className="block text-sm font-medium text-slate-700"
                  >
                    {t.auth.otp}
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      defaultValue={state.otp}
                      required
                      maxLength={6}
                      placeholder={t.auth.enterOtp}
                      className="border-slate-300"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      {t.auth.otpHint}
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isResending}
                      className={`text-xs font-medium ${
                        resendCooldown > 0 || isResending
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-indigo-600 hover:text-indigo-700'
                      }`}
                    >
                      {isResending
                        ? t.auth.sending
                        : resendCooldown > 0
                        ? formatTemplate(t.auth.resendWithCooldown, { seconds: resendCooldown })
                        : t.auth.resendCode}
                    </button>
                  </div>
                </div>
              </>
            )}

            {state?.errorCode && (
              <div className="text-red-700 text-sm bg-red-50 p-4 rounded-lg border border-red-200 font-medium">
                {t.auth.errors[state.errorCode as keyof typeof t.auth.errors] ?? t.auth.errors.sendOtpFailed}
              </div>
            )}
            {state?.successCode && (
              <div className="text-green-700 text-sm bg-green-50 p-4 rounded-lg border border-green-200 font-medium">
                {t.auth.success[state.successCode as keyof typeof t.auth.success]}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                size="lg"
                disabled={pending || (mode === 'signup' && !otpSent && !agreeToDisclaimer)}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    {t.nav.loading}
                  </>
                ) : otpSent ? (
                  t.auth.verifyCode
                ) : mode === 'signin' ? (
                  t.auth.sendCode
                ) : (
                  t.auth.sendCode
                )}
              </Button>
            </div>

            {otpSent && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {t.auth.changePhone}
                </button>
              </div>
            )}
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
                  ? t.auth.newToPlatform
                  : t.auth.alreadyHaveAccount}
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
                ? t.auth.createAccount
                : t.auth.signInExisting}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
