import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

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
    partial_cod_shipping_cost: 150,
    promo_codes: '[]',
    hero_image: '',
    collection_image_1: '',
    collection_image_2: '',
    collection_image_3: '',
    size_chart_data: JSON.stringify([
      { size: 'S', chest: '22"', length: '28"' },
      { size: 'M', chest: '24"', length: '29"' },
      { size: 'L', chest: '26"', length: '30"' },
      { size: 'XL', chest: '28"', length: '31"' }
    ]),
    instagram_link: 'https://instagram.com/iliked.in',
    whatsapp_number: '',
    store_address: 'Designed in Mumbai, India'
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
  if (data.partial_cod_shipping_cost === undefined || data.partial_cod_shipping_cost === null) {
    finalData.partial_cod_shipping_cost = defaultSettings.partial_cod_shipping_cost;
  }
  if (data.promo_codes === undefined || data.promo_codes === null) {
    finalData.promo_codes = defaultSettings.promo_codes;
  }
  if (data.size_chart_data === undefined || data.size_chart_data === null) {
    finalData.size_chart_data = defaultSettings.size_chart_data;
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
  if (data.instagram_link === undefined || data.instagram_link === null) {
    finalData.instagram_link = defaultSettings.instagram_link;
  }
  if (data.whatsapp_number === undefined || data.whatsapp_number === null) {
    finalData.whatsapp_number = defaultSettings.whatsapp_number;
  }
  if (data.store_address === undefined || data.store_address === null) {
    finalData.store_address = defaultSettings.store_address;
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
