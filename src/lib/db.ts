import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  color: string;
  image: string;
  hoverImage: string;
  bgColor: string;
  stock: number;
  tag: string;
  featured: boolean;
  description: string;
}

export interface ProductTagData {
  label?: string; // e.g. "NEW", "SELLING FAST"
  isPreorder?: boolean;
  preorderMessage?: string; // e.g. "SHIPS BY 15TH OCT"
}

export function parseProductTag(tagString?: string): ProductTagData {
  if (!tagString) return {};
  try {
    const parsed = JSON.parse(tagString);
    if (typeof parsed === 'object') return parsed;
  } catch (e) {
    // If it's just a raw string like "NEW" from old data
    return { label: tagString };
  }
  return {};
}

export function stringifyProductTag(data: ProductTagData): string {
  // If there's no preorder info and just a label, we could optionally just save the string,
  // but saving JSON is safer and uniform going forward.
  return JSON.stringify(data);
}

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: any[];
  created_at?: string;
}

export interface StoreSettings {
  id?: string;
  store_name: string;
  contact_email: string;
  currency: string;
  maintenance_mode: boolean;
  free_shipping_threshold: number;
  shipping_cost: number;
  partial_cod_shipping_cost?: number;
  promo_codes?: string; // JSON string representing array of {code: string, discount: number}
  hero_image?: string;
  collection_image_1?: string;
  collection_image_2?: string;
  collection_image_3?: string;
  size_chart_data?: string; // JSON string representing array of {size: string, chest: string, length: string}
  instagram_link?: string;
  whatsapp_number?: string;
  store_address?: string;
  gst_number?: string;
}

export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data || [];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) {
    console.error("Error updating product:", error);
    return null;
  }
  return data;
}

export async function addProduct(product: Omit<Product, 'id'>) {
  const newId = Date.now().toString();
  const { data, error } = await supabase.from('products').insert([{ ...product, id: newId }]).select().single();
  if (error) {
    console.error("Error adding product:", error);
    return null;
  }
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error("Error deleting product:", error);
  }
}
