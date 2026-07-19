import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

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

export interface DB {
  products: Product[];
  settings: {
    storeName: string;
    isStoreOpen: boolean;
  };
  orders: any[];
}

export function readDB(): DB {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading DB:", error);
    return { products: [], settings: { storeName: 'I LIKED', isStoreOpen: true }, orders: [] };
  }
}

export function writeDB(data: DB): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing DB:", error);
  }
}

// Helper Functions for Products
export function getProducts() {
  return readDB().products;
}

export function getProductById(id: string) {
  return readDB().products.find(p => p.id === id);
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === id);
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...updates };
    writeDB(db);
    return db.products[index];
  }
  return null;
}

export function addProduct(product: Omit<Product, 'id'>) {
  const db = readDB();
  const newProduct = { ...product, id: Date.now().toString() };
  db.products.push(newProduct);
  writeDB(db);
  return newProduct;
}

export function deleteProduct(id: string) {
  const db = readDB();
  db.products = db.products.filter(p => p.id !== id);
  writeDB(db);
}
