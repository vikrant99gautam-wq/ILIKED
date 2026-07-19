import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateSizes() {
  console.log("Fetching products to migrate sizes...");
  const { data: products } = await supabase.from('products').select('*');
  
  if (!products) return;

  for (const product of products) {
    if (!product.sizes || product.sizes.length === 0) continue;
    
    // Check if already migrated
    if (product.sizes[0].includes(':')) continue;

    const totalStock = product.stock || 0;
    const qtyPerSize = Math.floor(totalStock / product.sizes.length) || 1;
    
    const newSizes = product.sizes.map(size => `${size}:${qtyPerSize}`);

    await supabase
      .from('products')
      .update({ sizes: newSizes })
      .eq('id', product.id);
      
    console.log(`Migrated ${product.name}: [${product.sizes.join(', ')}] -> [${newSizes.join(', ')}]`);
  }
  console.log("Finished migrating sizes!");
}

migrateSizes();
