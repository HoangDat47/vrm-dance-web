import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET - List all models
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ models: data }, { status: 200 });
  } catch (error) {
    console.error('Get models error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new model
export async function POST(request: NextRequest) {
  try {
    const { name, path, avatar, rotation, scale } = await request.json();
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
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Failed to read user role:', profileError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('models')
      .insert([
        {
          name,
          path,
          avatar: avatar || null,
          rotation: rotation || 0,
          scale: scale || 1.25,
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
      { message: 'Model created successfully', model: data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create model error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update model
export async function PUT(request: NextRequest) {
  try {
    const { id, name, rotation, scale } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const updateData: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (rotation !== undefined) updateData.rotation = rotation;
    if (scale !== undefined) updateData.scale = scale;

    const { data, error } = await supabase
      .from('models')
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
      { message: 'Model updated successfully', model: data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update model error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete model
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
        { error: 'Model ID is required' },
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
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Failed to read user role:', profileError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get model info to delete files
    const { data: model, error: fetchError } = await supabase
      .from('models')
      .select('path, avatar')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 400 }
      );
    }

    // Delete VRM file from storage
    if (model.path) {
      const vrmFileName = model.path.split('/').pop();
      if (vrmFileName) {
        await supabase.storage
          .from('vrm-models')
          .remove([vrmFileName]);
      }
    }

    // Delete avatar from storage
    if (model.avatar) {
      const avatarFileName = model.avatar.split('/').pop();
      if (avatarFileName) {
        await supabase.storage
          .from('avatars')
          .remove([avatarFileName]);
      }
    }

    // Delete model record
    const { error: deleteError } = await supabase
      .from('models')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Model deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete model error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
