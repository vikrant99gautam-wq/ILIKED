import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  // If table exists but is empty, return a default object
  if (error && error.code === 'PGRST116') {
    return NextResponse.json({
      store_name: 'I LIKED',
      contact_email: 'hello@iliked.com',
      currency: 'USD',
      maintenance_mode: false
    });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Assuming there's only one settings row, we can just update id=1 or upsert
    // Let's use upsert with a fixed ID of '1'
    const updatedSettings = {
      ...body,
      id: '1'
    };

    const { data, error } = await supabase
      .from('settings')
      .upsert(updatedSettings)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
