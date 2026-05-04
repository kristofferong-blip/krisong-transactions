import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TrackerPageClient from '@/components/TrackerPageClient';
export default async function TrackerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data } = await supabase.from('tracker_data').select('data').eq('user_id', user.id).single();
  return <TrackerPageClient userId={user.id} initialData={data?.data ?? null} />;
}