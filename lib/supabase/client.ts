import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Use new publishable key (sb_publishable_...) or fallback to anon key for backward compatibility
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    apiKey!
  );
}

