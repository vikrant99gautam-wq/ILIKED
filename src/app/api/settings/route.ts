import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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
    shipping_cost: 850,
    promo_codes: '[]',
    hero_image: '',
    collection_image_1: '',
    collection_image_2: '',
    collection_image_3: ''
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
  if (data.promo_codes === undefined || data.promo_codes === null) {
    finalData.promo_codes = defaultSettings.promo_codes;
  }
  if (data.hero_image === undefined || data.hero_image === null) {
    finalData.hero_image = defaultSettings.hero_image;
  }
  if (data.collection_image_1 === undefined || data.collection_image_1 === null) {
    finalData.collection_image_1 = defaultSettings.collection_image_1;
  }
  if (data.collection_image_2 === undefined || data.collection_image_2 === null) {
    finalData.collection_image_2 = defaultSettings.collection_image_2;
  }
  if (data.collection_image_3 === undefined || data.collection_image_3 === null) {
    finalData.collection_image_3 = defaultSettings.collection_image_3;
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
