import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  try {
    const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    if (dbData.products && dbData.products.length > 0) {
      console.log(`Found ${dbData.products.length} products to seed.`);
      const { data, error } = await supabase.from('products').insert(dbData.products);
      
      if (error) {
        console.error("Error seeding products:", error);
      } else {
        console.log("Successfully seeded products:", data);
      }
    } else {
      console.log("No products found in db.json to seed.");
    }
  } catch (error) {
    console.error("Script failed:", error);
  }
}

seed();
