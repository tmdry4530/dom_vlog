import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getUserByUsername } from '@/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  
  const cookieStore = await cookies();
  const user = await getUserByUsername(username, cookieStore);


  if (!user || !user.email) {
    return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
  }

  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  return NextResponse.json({ message: 'Login successful' });
}
