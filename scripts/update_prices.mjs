import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePrices() {
  console.log("Fetching products...");
  const { data: products, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`Found ${products.length} products. Updating prices...`);
  
  for (const product of products) {
    if (product.price < 500) { // Only update if price is low (likely USD)
      const newPrice = product.price * 85;
      const { error: updateError } = await supabase
        .from('products')
        .update({ price: newPrice })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError);
      } else {
        console.log(`Updated ${product.name}: ₹${product.price} -> ₹${newPrice}`);
      }
    }
  }
  
  console.log("Finished updating prices!");
}

updatePrices();
