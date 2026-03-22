import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './admin-layout-client';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user's profile to check admin status
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('platform_role')
    .eq('id', user.id)
    .single() as { data: { platform_role: string } | null; error: any };

  if (error || !profile) {
    redirect('/dashboard');
  }

  // Check if user is admin or superadmin (platform admin)
  const isAdmin = profile.platform_role === 'admin' || profile.platform_role === 'superadmin';
  if (!isAdmin) {
    redirect('/dashboard');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
