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
  promo_codes?: string; // JSON string representing array of {code: string, discount: number}
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
