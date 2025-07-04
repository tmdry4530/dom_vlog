import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { username, password, email } = await request.json();
  
  const supabase = await createClient();
  
  // username이 제공된 경우, profiles 테이블에서 해당 사용자의 이메일을 찾기
  let loginEmail = email;
  
  if (username && !email) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', username)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 401 });
    }
    
    loginEmail = profile.email;
  }
  
  if (!loginEmail) {
    return NextResponse.json({ message: '이메일 또는 사용자명이 필요합니다.' }, { status: 400 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password,
  });

  if (error) {
    return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: 401 });
  }

  return NextResponse.json({ message: '로그인에 성공했습니다.' });
}
