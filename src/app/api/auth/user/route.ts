import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const { userId } = await auth();
    console.log('[auth/user] Clerk userId:', userId);

    if (!userId) {
      console.error('[auth/user] No userId from Clerk auth');
      return NextResponse.json({ error: 'Unauthorized - No Clerk session' }, { status: 401 });
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('[auth/user] Missing Supabase env vars:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceRoleKey,
      });
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('[auth/user] Failed to read user from Supabase:', fetchError);
      return NextResponse.json(
        { error: 'Failed to read user', details: fetchError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log('[auth/user] User already exists:', userId);
      return NextResponse.json({ user: existingUser }, { status: 200 });
    }

    console.log('[auth/user] User not found, creating new user:', userId);
    const clerkUser = await currentUser();
    console.log('[auth/user] Clerk user data:', { id: clerkUser?.id, email: clerkUser?.primaryEmailAddress?.emailAddress });

    const email = clerkUser?.primaryEmailAddress?.emailAddress || '';
    const username = clerkUser?.username || clerkUser?.firstName || null;

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          clerk_id: userId,
          email,
          username,
          role: 'user',
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('[auth/user] Failed to create user in Supabase:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user', details: insertError.message },
        { status: 500 }
      );
    }

    console.log('[auth/user] User created successfully:', newUser.id);
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('[auth/user] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
