import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  const defaultSettings = {
    store_name: 'I LIKED',
    contact_email: 'hello@iliked.com',
    currency: 'INR',
    maintenance_mode: false,
    free_shipping_threshold: 2000,
    shipping_cost: 850
  };

  // If table exists but is empty
  if (error && error.code === 'PGRST116') {
    return NextResponse.json(defaultSettings);
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Inject defaults for new columns if they are null/undefined
  const finalData = {
    ...defaultSettings,
    ...data
  };
  // Ensure we don't override 0 values with defaults using fallback, but if they are literally missing from schema they might be undefined
  if (data.free_shipping_threshold === undefined || data.free_shipping_threshold === null) {
    finalData.free_shipping_threshold = defaultSettings.free_shipping_threshold;
  }
  if (data.shipping_cost === undefined || data.shipping_cost === null) {
    finalData.shipping_cost = defaultSettings.shipping_cost;
  }

  return NextResponse.json(finalData);
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
