'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { supabase } from '@/lib/supabase';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // Query ke Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error) {
    console.error('Supabase Auth Error:', error.message);
  }

  if (user && !error) {
    const cookieStore = await cookies();
    
    cookieStore.set('auth_token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return { success: true };
  }

  return { success: false, message: 'Username atau password salah!' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/');
}
