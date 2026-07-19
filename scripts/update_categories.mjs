import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCategories() {
  console.log("Fetching products...");
  const { data: products } = await supabase.from('products').select('*');
  
  if (!products) return;

  for (const product of products) {
    let newCategory = "NORMAL TEES";
    
    if (product.category === "HOODIES" || product.name.includes("HOODIE")) {
      newCategory = "OVERSIZED TEES";
    } else if (product.category === "ACCESSORIES" || product.name.includes("CAP") || product.name.includes("BEANIE")) {
      newCategory = "OPTIC WASH TEES";
    }

    if (product.category !== newCategory) {
      await supabase
        .from('products')
        .update({ category: newCategory })
        .eq('id', product.id);
      console.log(`Updated ${product.name} to ${newCategory}`);
    }
  }
  console.log("Finished updating categories!");
}

updateCategories();
