'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { validatedAction } from '@/lib/auth/middleware';
import { logError } from '@/lib/utils/logger';

// Phone number validation schema
const sendOtpSchema = z
  .object({
    // UI will translate these "error codes"
    phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'invalidPhone'),
    mode: z.string().optional(),
    agreeToDisclaimer: z.string().optional(),
  })
  .refine(
    (data) => {
      // When signing up, user must agree to disclaimer
      if (data.mode === 'signup') {
        return data.agreeToDisclaimer === 'true';
      }
      return true;
    },
    { message: 'disclaimerRequired', path: ['agreeToDisclaimer'] }
  );

export const sendOtp = validatedAction(sendOtpSchema, async (data, formData) => {
  const { phone } = data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    return {
      errorCode: 'sendOtpFailed',
      phone
    };
  }

  return {
    successCode: 'otpSent',
    otpSent: true,
    phone
  };
});

// OTP verification schema
const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  // UI will translate these "error codes"
  otp: z.string().length(6, 'otpSixDigits')
});

export const verifyOtp = validatedAction(verifyOtpSchema, async (data, formData) => {
  const { phone, otp } = data;
  const supabase = await createClient();

  const { data: verifyData, error } = await supabase.auth.verifyOtp({
    phone,
    token: otp,
    type: 'sms'
  });

  if (error) {
    return {
      errorCode: 'invalidOtp',
      phone,
      otp
    };
  }

  if (!verifyData.session || !verifyData.user) {
    return {
      errorCode: 'sessionFailed',
      phone,
      otp
    };
  }

  // Successfully authenticated - create user_preferences record if it doesn't exist
  const userId = verifyData.user.id;
  
  // Remove '+' sign from phone number before saving
  const phoneWithoutPlus = phone.replace(/^\+/, '');
  
  // Check if user preferences already exist
  const { data: existingPrefs } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', userId)
    .single();

  // If no preferences exist, create them
  if (!existingPrefs) {
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        phone_no: phoneWithoutPlus, // Store without '+' sign
        boss_type: 'execution', // Default boss type
        boss_language: 'en', // Default language
      });

    if (prefsError) {
      logError('Failed to create user preferences', prefsError);
    }
  }

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    redirect('/pricing');
  }

  redirect('/app/goals');
});

// Keep old email/password functions for backward compatibility or alternative auth
const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;
  const supabase = await createClient();

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errorCode: 'invalidEmailOrPassword',
      email,
      password
    };
  }

  // Ensure user preferences exist (for users created before this change)
  if (signInData.user) {
    const userId = signInData.user.id;
    
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!existingPrefs) {
      await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          email: email,
          boss_type: 'execution',
          boss_language: 'en',
        });
    }
  }

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    // Will handle checkout redirect later
    redirect('/pricing');
  }

  redirect('/app/goals');
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password } = data;
  const supabase = await createClient();

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || 'http://localhost:3000'}/app/goals`,
    },
  });

  if (error) {
    return {
      errorCode: 'signUpFailed',
      email,
      password
    };
  }

  // Check if email confirmation is required
  // If user is immediately confirmed (e.g., in development), redirect
  // Otherwise, show a message that they need to confirm their email
  if (signUpData.user && signUpData.session) {
    // User is immediately authenticated (no email confirmation required)
    const userId = signUpData.user.id;
    
    // Check if user preferences already exist
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    // If no preferences exist, create them
    if (!existingPrefs) {
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          email: email,
          boss_type: 'execution', // Default boss type
          boss_language: 'en', // Default language
        });

      if (prefsError) {
        logError('Failed to create user preferences', prefsError);
      }
    }

    const redirectTo = formData.get('redirect') as string | null;
    if (redirectTo === 'checkout') {
      redirect('/pricing');
    }
    redirect('/app/goals');
  } else {
    // Email confirmation required
    return {
      successCode: 'checkEmailToConfirm',
      email,
      password: '' // Don't return password for security
    };
  }
});

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}

// Note: The following functions were part of the old team-based system.
// They are stubbed out for MVP compatibility but not functional.
// These old dashboard pages should be removed or updated for Bossy MVP.

export const updatePassword = validatedAction(
  z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  }),
  async () => {
    return { error: 'Password update not implemented in MVP. Use Supabase Dashboard to manage passwords.' };
  }
);

export const deleteAccount = validatedAction(
  z.object({
    password: z.string(),
  }),
  async () => {
    return { error: 'Account deletion not implemented in MVP. Contact support if needed.' };
  }
);

export const updateAccount = validatedAction(
  z.object({
    name: z.string(),
    email: z.string(),
  }),
  async () => {
    return { error: 'Account update not implemented in MVP.' };
  }
);

export const removeTeamMember = validatedAction(
  z.object({
    memberId: z.string(),
  }),
  async () => {
    return { error: 'Team features not available in Bossy MVP.' };
  }
);

export const inviteTeamMember = validatedAction(
  z.object({
    email: z.string(),
    role: z.string(),
  }),
  async () => {
    return { error: 'Team features not available in Bossy MVP.' };
  }
);
