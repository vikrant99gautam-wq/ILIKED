import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Auto-generate ID or use Supabase UUID if you prefer, but we'll use Date.now() for consistency with products
    const newId = Date.now().toString();
    
    const newOrder = {
      ...body,
      id: newId,
      status: 'Pending',
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    // Check if a promo code was used
    const promoItem = body.items?.find((i: any) => i.id.startsWith("PROMO-"));
    if (promoItem) {
      const codeUsed = promoItem.id.replace("PROMO-", "");
      // Fetch settings, update the currentUses, and save back
      const { data: settingsData } = await supabase.from('settings').select('*').limit(1);
      if (settingsData && settingsData.length > 0) {
        const currentSettings = settingsData[0];
        try {
          const promos = JSON.parse(currentSettings.promo_codes || "[]");
          const updatedPromos = promos.map((p: any) => {
            if (p.code.toUpperCase() === codeUsed.toUpperCase()) {
              return { ...p, currentUses: (p.currentUses || 0) + 1 };
            }
            return p;
          });
          await supabase.from('settings').update({ promo_codes: JSON.stringify(updatedPromos) }).eq('id', currentSettings.id);
        } catch (e) {
          console.error("Failed to update promo uses", e);
        }
      }
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Order placement error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
