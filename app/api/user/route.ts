import { getUser } from '@/lib/supabase/get-session';

export async function GET() {
  const user = await getUser();
  return Response.json(user);
}
