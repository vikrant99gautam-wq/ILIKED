"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FOMOBar from "@/components/FOMOBar";
import { useWishlistStore } from "@/lib/store";

const CATEGORIES = ["NORMAL TEES", "OVERSIZED TEES", "OPTIC WASH TEES"];
const SIZES = ["S", "M", "L", "XL", "ONE SIZE"];
const COLORS = [
  { name: "BLACK", hex: "#111" },
  { name: "WHITE", hex: "#fff" },
  { name: "RED", hex: "var(--color-coral-red)" },
  { name: "BLUE", hex: "var(--color-electric-blue)" },
  { name: "YELLOW", hex: "#FFD700" }
];

export default function ShopGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("NEWEST");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const toggleLike = useWishlistStore((state) => state.toggleLike);
  const isLiked = useWishlistStore((state) => state.isLiked);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data));
  }, []);

  // Toggle helpers
  const toggleArrayItem = (array: string[], setArray: (val: string[]) => void, item: string) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  // Filter & Sort Logic
  const filteredProducts = [...products].filter(p => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    if (selectedSizes.length > 0 && !p.sizes.some((s: string) => selectedSizes.includes(s.split(':')[0]))) return false;
    if (selectedColors.length > 0 && !selectedColors.includes(p.color)) return false;
    return true;
  });

  if (sortBy === "PRICE_LOW") filteredProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "PRICE_HIGH") filteredProducts.sort((a, b) => b.price - a.price);

  return (
    <section className="relative w-full min-h-screen bg-[#F4F4F0] pt-[120px] pb-24 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Shop Header */}
        <div className="mb-8 border-b-[4px] border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-cartoon text-6xl md:text-8xl text-black tracking-widest drop-shadow-[4px_4px_0_var(--color-coral-red)]">
              THE DROPS
            </h1>
            <p className="font-black text-black text-sm md:text-base tracking-widest uppercase mt-2">
              Showing {filteredProducts.length} items
            </p>
          </div>

          <div className="flex gap-4">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="lg:hidden cartoon-btn px-6 py-2 bg-black text-white font-black tracking-widest"
            >
              {isMobileFiltersOpen ? "CLOSE FILTERS" : "FILTERS"}
            </button>
            
            {/* Sort Dropdown (Styled as a chunky box) */}
            <div className="relative border-[3px] border-black shadow-[4px_4px_0_#111] bg-white">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none outline-none font-black tracking-widest bg-transparent px-6 py-2 pr-12 uppercase cursor-pointer"
              >
                <option value="NEWEST">Newest</option>
                <option value="PRICE_LOW">Price: Low - High</option>
                <option value="PRICE_HIGH">Price: High - Low</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black text-xl">
                ↓
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <div className={`
            fixed inset-0 z-[110] bg-white lg:sticky lg:top-[100px] lg:z-0 lg:h-[calc(100vh-120px)] lg:bg-transparent lg:w-[280px] shrink-0 flex flex-col gap-8 transition-all overflow-y-auto p-6 lg:p-0 pt-20 lg:pt-0
            ${isMobileFiltersOpen ? "block" : "hidden lg:flex"}
          `}>
            
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="lg:hidden absolute top-6 right-6 w-10 h-10 border-[3px] border-black flex items-center justify-center font-black text-xl hover:bg-gray-100"
            >
              X
            </button>
            <h2 className="lg:hidden font-cartoon text-4xl mb-4 border-b-[4px] border-black pb-4">FILTERS</h2>

            {/* Categories */}
            <div className="border-[4px] border-black p-5 bg-white shadow-[6px_6px_0_#111]">
              <h3 className="font-cartoon text-2xl tracking-widest mb-4">CATEGORY</h3>
              <div className="flex flex-col gap-3">
                {CATEGORIES.map(cat => (
                  <div 
                    key={cat} 
                    onClick={() => toggleArrayItem(selectedCategories, setSelectedCategories, cat)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-6 h-6 border-[3px] border-black flex items-center justify-center transition-colors
                      ${selectedCategories.includes(cat) ? "bg-[var(--color-electric-blue)]" : "bg-white group-hover:bg-gray-100"}`}
                    >
                      {selectedCategories.includes(cat) && <span className="font-black text-white leading-none mb-1">x</span>}
                    </div>
                    <span className="font-black tracking-widest uppercase text-sm">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="border-[4px] border-black p-5 bg-white shadow-[6px_6px_0_#111]">
              <h3 className="font-cartoon text-2xl tracking-widest mb-4">SIZE</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button 
                    key={size}
                    onClick={() => toggleArrayItem(selectedSizes, setSelectedSizes, size)}
                    className={`min-w-[40px] px-2 h-[40px] border-[3px] border-black font-black uppercase transition-transform
                      ${selectedSizes.includes(size) ? "bg-black text-white shadow-[3px_3px_0_var(--color-coral-red)] -translate-y-1" : "bg-white text-black hover:bg-gray-100"}
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="border-[4px] border-black p-5 bg-white shadow-[6px_6px_0_#111]">
              <h3 className="font-cartoon text-2xl tracking-widest mb-4">COLOR</h3>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => toggleArrayItem(selectedColors, setSelectedColors, color.name)}
                    className={`w-10 h-10 rounded-full border-[3px] border-black flex items-center justify-center transition-transform hover:scale-110
                      ${selectedColors.includes(color.name) ? "ring-2 ring-offset-2 ring-black scale-110 shadow-[2px_2px_0_#111]" : ""}
                    `}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategories.length > 0 || selectedSizes.length > 0 || selectedColors.length > 0) && (
              <button 
                onClick={() => { setSelectedCategories([]); setSelectedSizes([]); setSelectedColors([]); setIsMobileFiltersOpen(false); }}
                className="font-black tracking-widest uppercase text-sm text-[var(--color-coral-red)] underline hover:text-black transition-colors"
              >
                Clear All Filters
              </button>
            )}
            
            {/* Mobile Apply Button */}
            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="lg:hidden mt-4 cartoon-btn px-6 py-4 bg-black text-white font-black tracking-widest text-xl w-full"
            >
              APPLY FILTERS
            </button>

          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="w-full py-20 flex flex-col items-center justify-center border-[4px] border-dashed border-black">
                 <h2 className="font-cartoon text-4xl mb-2">NOTHING HERE!</h2>
                 <p className="font-black tracking-widest uppercase">Try removing some filters.</p>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={product.id}
                      onClick={() => window.location.href = `/shop/${product.id}`}
                      className="cartoon-card relative bg-white bg-paper-noise p-4 pb-6 flex flex-col cursor-pointer group"
                    >
                      {/* Product Image Area */}
                      <div className={`relative w-full aspect-[4/5] ${product.bgColor} border-[4px] border-black shadow-inner mb-6 overflow-hidden flex items-center justify-center`}>
                        {/* Wishlist Heart */}
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            toggleLike({ 
                              id: product.id, 
                              name: product.name, 
                              price: product.price, 
                              image: product.image?.split(',')[0].trim() 
                            }); 
                          }}
                          className={`absolute top-4 right-4 z-20 w-12 h-12 border-[3px] border-black flex items-center justify-center transition-transform hover:scale-110 shadow-[4px_4px_0_#111] ${isLiked(product.id) ? 'bg-[#FFD700] text-black' : 'bg-white text-black'}`}
                        >
                          <svg className="w-6 h-6" fill={isLiked(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>

                        {/* Halftone dots overlay */}
                        <div 
                          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                          style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '12px 12px' }}
                        ></div>
                        
                        {/* Primary Image */}
                        <img 
                          src={product.image ? product.image.split(',')[0].trim() : ''} 
                          alt={product.name}
                          className="absolute w-[115%] h-[115%] object-contain drop-shadow-[6px_6px_0_#111] group-hover:scale-[1.05] group-hover:opacity-0 transition-all duration-500 z-10"
                        />

                        {/* Hover Image */}
                        <img 
                          src={product.hoverImage} 
                          alt={`${product.name} alternate view`}
                          className="absolute w-[115%] h-[115%] object-contain drop-shadow-[6px_6px_0_#111] opacity-0 group-hover:scale-[1.05] group-hover:opacity-100 transition-all duration-500 z-10"
                        />
                      </div>

                      {/* Product Info Area */}
                      <div className="flex flex-col w-full group-hover:translate-x-1 transition-transform duration-300 relative">
                        <h3 className="font-cartoon text-2xl text-black tracking-wide leading-tight group-hover:text-[var(--color-electric-blue)] transition-colors mb-3">
                          {product.name}
                        </h3>
                        
                        <FOMOBar stockLeft={product.stock} />
                        
                        {/* Price Tag Sticker */}
                        <div className="absolute -top-12 right-0 bg-[#FFD700] border-[3px] border-black px-4 py-1 rotate-[5deg] group-hover:rotate-[-5deg] group-hover:scale-110 transition-transform shadow-[4px_4px_0_#111]">
                          <span className="font-black text-black text-lg">₹{product.price}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
