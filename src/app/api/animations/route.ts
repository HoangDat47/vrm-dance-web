import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET - List all animations
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('animations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ animations: data }, { status: 200 });
  } catch (error) {
    console.error('Get animations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new animation
export async function POST(request: NextRequest) {
  try {
    const { name, path, duration } = await request.json();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!name || !path) {
      return NextResponse.json({ error: 'Name and path are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('clerk_id', userId)
      .single();

    if (profileError) {
      console.error('Failed to read user role:', profileError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('animations')
      .insert([
        {
          name,
          path,
          duration: duration || null,
          created_by: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Animation created successfully', animation: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create animation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update animation
export async function PUT(request: NextRequest) {
  try {
    const { id, name, duration } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Animation ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const updateData: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (duration !== undefined) updateData.duration = duration;

    const { data, error } = await supabase
      .from('animations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Animation updated successfully', animation: data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update animation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete animation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Animation ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('clerk_id', userId)
      .single();

    if (profileError) {
      console.error('Failed to read user role:', profileError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get animation info to delete file
    const { data: animation, error: fetchError } = await supabase
      .from('animations')
      .select('path')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 400 }
      );
    }

    // Delete animation file from storage
    if (animation.path) {
      const animationFileName = animation.path.split('/').pop();
      if (animationFileName) {
        await supabase.storage
          .from('animations')
          .remove([animationFileName]);
      }
    }

    // Delete animation record
    const { error: deleteError } = await supabase
      .from('animations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Animation deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete animation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
