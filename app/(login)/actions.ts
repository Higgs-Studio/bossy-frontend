'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { validatedAction } from '@/lib/auth/middleware';

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: 'Invalid email or password. Please try again.',
      email,
      password
    };
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
      error: error.message || 'Failed to create user. Please try again.',
      email,
      password
    };
  }

  // Check if email confirmation is required
  // If user is immediately confirmed (e.g., in development), redirect
  // Otherwise, show a message that they need to confirm their email
  if (signUpData.user && signUpData.session) {
    // User is immediately authenticated (no email confirmation required)
    const redirectTo = formData.get('redirect') as string | null;
    if (redirectTo === 'checkout') {
      redirect('/pricing');
    }
    redirect('/app/goals');
  } else {
    // Email confirmation required
    return {
      success: 'Please check your email to confirm your account before signing in.',
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
