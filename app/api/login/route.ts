import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { username, password } = await request.json();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // In a real application, you should use a secure password hashing library like bcrypt.
  // For this example, we are storing passwords in plain text.
  if (password === data.password_hash) {
    return NextResponse.json({ message: 'Login successful' });
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}
