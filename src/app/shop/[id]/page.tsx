"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  // Fabric Zoom Lens State
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0, xPercent: 50, yPercent: 50 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  useEffect(() => {
    // Fetch product by ID
    if (params.id) {
      fetch(`/api/products/${params.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.error) setProduct(null);
          else setProduct(data);
        })
        .catch(() => setProduct(null));

      // Fetch related products
      fetch('/api/products')
        .then(r => r.json())
        .then(data => {
          if (!data.error && Array.isArray(data)) {
            setRelatedProducts(data.filter((p: any) => p.id !== params.id).slice(0, 3));
          }
        });
    }
  }, [params.id]);

  if (!product) return <div className="min-h-screen pt-[120px] text-center font-cartoon text-4xl">LOADING...</div>;

  // Build images array for gallery if they exist on the product, else fallback to primary image
  const productImages = product.images?.length > 0 ? product.images : [
    { src: product.image, color: product.bgColor },
    { src: product.hoverImage, color: "bg-[#FFD700]" }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setLensPosition({ x, y, xPercent, yPercent });
  };

  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[76px]">
      
      {/* Split Screen Container */}
      <div className="flex flex-col lg:flex-row w-full relative lg:min-h-[calc(100vh-76px)]">
        
        {/* Left Side: Command Center (Flows Naturally) */}
        <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 pt-16 lg:pt-24 flex flex-col justify-start bg-white border-b-[8px] lg:border-b-0 lg:border-r-[8px] border-black relative z-20">
          
          <h1 className="font-cartoon text-6xl md:text-8xl text-black tracking-widest leading-[0.8] mb-4 drop-shadow-[4px_4px_0_var(--color-electric-blue)] uppercase">
            {product.name}
          </h1>

          <div className="mb-6">
             <span className="font-sans font-black text-black text-3xl tracking-wide">${Number(product.price).toFixed(2)}</span>
          </div>

          {/* Size Selector */}
          <div className="mt-4 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black tracking-[0.2em] text-gray-500">SELECT SIZE</h3>
              <button 
                onClick={() => setIsSizeGuideOpen(true)} 
                className="font-black tracking-widest text-[var(--color-coral-red)] underline hover:text-black transition-colors"
              >
                SIZE GUIDE
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {product.sizes?.map((size: string) => {
                const inStock = product.stock > 0;
                return (
                  <button 
                    key={size}
                    disabled={!inStock}
                    onClick={() => setSelectedSize(size)}
                    className={`relative w-16 h-16 border-[4px] border-black font-cartoon text-3xl flex items-center justify-center transition-transform
                      ${!inStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : 
                        selectedSize === size ? "bg-black text-white shadow-[4px_4px_0_var(--color-coral-red)] scale-110" : "bg-white text-black hover:bg-gray-100 hover:-translate-y-1 shadow-[4px_4px_0_#111]"}
                    `}
                  >
                    {size}
                    {/* Out of stock strike */}
                    {!inStock && (
                      <span className="absolute inset-0 font-black text-[var(--color-coral-red)] text-5xl leading-none flex items-center justify-center pointer-events-none opacity-80">X</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buy Button */}
          <button className="w-full cartoon-btn py-6 bg-black hover:bg-[var(--color-electric-blue)] text-white border-[4px] border-black shadow-[8px_8px_0_#111] active:shadow-[2px_2px_0_#111] active:translate-y-1 active:translate-x-1 transition-all">
             <span className="font-cartoon text-4xl tracking-widest">ADD TO STASH</span>
          </button>

          {/* Details / Specs */}
          <div className="mt-12 p-6 border-[3px] border-dashed border-black bg-[#F4F4F0]">
            <p className="font-mono text-sm md:text-base font-bold text-black uppercase leading-relaxed">
              {product.description}
            </p>
          </div>

        </div>

        {/* Right Side: Interactive Gallery */}
        <div className="w-full lg:w-[55%] h-[70vh] lg:h-auto bg-[#F4F4F0] relative z-10 flex flex-col border-b-[8px] lg:border-b-0 lg:border-r-[8px] border-black">
          
          {/* Main Image Area */}
          <div 
            className={`relative w-full flex-1 flex items-center justify-center overflow-hidden transition-colors duration-500 ${isHoveringImage ? 'cursor-none' : 'cursor-crosshair'} ${productImages[activeImageIndex]?.color || product.bgColor}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
          >
            {/* The Microscope Lens */}
            <AnimatePresence>
              {isHoveringImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
                  className="absolute pointer-events-none z-50 rounded-full border-[6px] border-black shadow-[15px_15px_0_rgba(0,0,0,0.6)] overflow-hidden bg-white"
                  style={{
                    width: '300px',
                    height: '300px',
                    left: lensPosition.x - 150, // center on cursor
                    top: lensPosition.y - 150,
                    backgroundImage: `url(${productImages[activeImageIndex]?.src})`,
                    backgroundSize: '300%', // 3x zoom
                    backgroundPosition: `${lensPosition.xPercent}% ${lensPosition.yPercent}%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Crosshair Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-full h-[2px] bg-black absolute"></div>
                    <div className="h-full w-[2px] bg-black absolute"></div>
                    {/* Ring */}
                    <div className="w-[120px] h-[120px] rounded-full border-[2px] border-black absolute"></div>
                  </div>
                  
                  {/* Halftone texture inside lens */}
                  <div 
                    className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
                  ></div>
                  
                  {/* Lens Label */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black px-3 py-1 border-[2px] border-white/20 rounded-sm">
                    <span className="font-mono text-[10px] text-white tracking-widest uppercase">100% COTTON</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Halftone Overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
            ></div>

            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.1, x: -50 }}
                transition={{ duration: 0.3 }}
                src={productImages[activeImageIndex]?.src} 
                alt={`${product.name} Angle ${activeImageIndex}`}
                className="relative z-10 w-[90%] h-[90%] lg:w-[95%] lg:h-[95%] object-contain drop-shadow-[12px_12px_0_#111]"
              />
            </AnimatePresence>

            {/* Arrows */}
            <button 
              onClick={() => setActiveImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 bg-white border-[3px] border-black flex items-center justify-center hover:bg-[var(--color-electric-blue)] hover:text-white hover:scale-110 transition-all z-30 shadow-[4px_4px_0_#111]"
            >
              <span className="font-black text-2xl lg:text-3xl">←</span>
            </button>

            <button 
              onClick={() => setActiveImageIndex(prev => (prev + 1) % productImages.length)}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 bg-white border-[3px] border-black flex items-center justify-center hover:bg-[var(--color-coral-red)] hover:text-white hover:scale-110 transition-all z-30 shadow-[4px_4px_0_#111]"
            >
              <span className="font-black text-2xl lg:text-3xl">→</span>
            </button>

            {/* Floating Sticker Easter Egg */}
            <motion.div 
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              className="absolute top-[10%] right-[10%] z-40 cursor-grab"
              whileHover={{ scale: 1.1 }}
              whileDrag={{ scale: 1.2, cursor: "grabbing" }}
            >
              <div className="bg-white border-[4px] border-black px-4 py-2 rotate-12 shadow-[6px_6px_0_#111]">
                 <span className="font-cartoon text-xl tracking-widest text-[var(--color-coral-red)]">DRAG ME!</span>
              </div>
            </motion.div>
          </div>

          {/* Thumbnails (Previews) */}
          <div className="h-28 lg:h-36 border-t-[8px] border-black flex bg-white shrink-0 overflow-x-auto">
            {productImages.map((img: any, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImageIndex(i)}
                className={`relative min-w-[100px] flex-1 h-full border-r-[4px] last:border-r-0 border-black overflow-hidden flex items-center justify-center transition-all ${activeImageIndex === i ? 'bg-[#FFD700]' : 'bg-[#F4F4F0] hover:bg-white'}`}
              >
                <img src={img.src} className={`h-[80%] object-contain drop-shadow-[4px_4px_0_#111] transition-transform ${activeImageIndex === i ? 'scale-[1.3]' : 'scale-100 opacity-60 hover:opacity-100'}`} alt="Thumbnail" />
                {activeImageIndex === i && (
                  <div className="absolute inset-0 border-[4px] lg:border-[6px] border-black pointer-events-none"></div>
                )}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* WE ALSO LIKED SECTION */}
      <section className="w-full bg-[#F4F4F0] py-24 md:py-32 px-6 md:px-12 border-t-[8px] border-black z-30 relative">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="flex items-center justify-between mb-16 border-b-[4px] border-black pb-8">
            <h2 className="font-cartoon text-5xl md:text-7xl text-black tracking-widest drop-shadow-[4px_4px_0_var(--color-electric-blue)]">
              WE ALSO LIKED
            </h2>
            <div className="hidden md:flex gap-2">
              <span className="w-4 h-4 bg-black rounded-full block"></span>
              <span className="w-4 h-4 bg-[var(--color-coral-red)] rounded-full block"></span>
              <span className="w-4 h-4 bg-[var(--color-electric-blue)] rounded-full block"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relProduct) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                onClick={() => window.location.href = `/shop/${relProduct.id}`}
                key={relProduct.id}
                className="group relative bg-white border-[4px] border-black shadow-[8px_8px_0_#111] hover:shadow-[12px_12px_0_#111] transition-all flex flex-col cursor-pointer duration-300"
              >
                {/* Product Image Area */}
                <div className={`relative w-full aspect-[4/5] ${relProduct.bgColor} border-b-[4px] border-black overflow-hidden flex items-center justify-center`}>
                  {/* Halftone dots */}
                  <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '12px 12px' }}></div>
                  
                  {/* Primary Image */}
                  <img src={relProduct.image} alt={relProduct.name} className="absolute w-full h-full object-contain drop-shadow-[6px_6px_0_#111] scale-[1.3] group-hover:scale-[1.4] group-hover:opacity-0 transition-all duration-500 z-10" />

                  {/* Hover Image */}
                  <img src={relProduct.hoverImage} alt={`${relProduct.name} alternate`} className="absolute w-full h-full object-contain drop-shadow-[6px_6px_0_#111] opacity-0 scale-[1.15] group-hover:scale-[1.4] group-hover:opacity-100 transition-all duration-500 z-10" />
                </div>

                {/* Product Info Area */}
                <div className="p-5 bg-white relative">
                  <h3 className="font-cartoon text-2xl text-black tracking-wide leading-tight group-hover:text-[var(--color-electric-blue)] transition-colors">
                    {relProduct.name}
                  </h3>
                  
                  <div className="absolute -top-5 right-4 bg-[#FFD700] border-[3px] border-black px-4 py-1 rotate-[5deg] group-hover:rotate-[-5deg] group-hover:scale-110 transition-transform shadow-[4px_4px_0_#111]">
                    <span className="font-black text-black text-lg">${relProduct.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Dirty Napkin Size Chart Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsSizeGuideOpen(false)}
            />
            
            {/* The Dirty Napkin */}
            <motion.div 
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 2, opacity: 1 }}
              exit={{ scale: 0.8, rotate: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative z-10 w-[95vw] md:w-[80vw] max-w-[500px] aspect-[4/5] md:aspect-square bg-[#fcfaf5] p-8 md:p-12 shadow-[15px_15px_40px_rgba(0,0,0,0.6)]"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.05) 100%), url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")',
                borderRadius: "2px 16px 4px 12px", // Uneven paper edges
                border: "1px solid rgba(0,0,0,0.2)",
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsSizeGuideOpen(false)} 
                className="absolute top-4 right-4 font-cartoon text-3xl text-black/60 hover:text-[var(--color-coral-red)] transition-colors"
              >
                X
              </button>
              
              {/* Fake coffee stains & dirt */}
              <div className="absolute top-8 left-8 w-16 h-16 md:w-24 md:h-24 rounded-full border-[3px] border-[#8b5a2b] opacity-20 pointer-events-none mix-blend-multiply"></div>
              <div className="absolute bottom-12 right-6 w-20 h-20 md:w-32 md:h-32 rounded-full border-[4px] border-[#5c3e21] opacity-10 pointer-events-none mix-blend-multiply"></div>
              <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-black opacity-5 rounded-full blur-[2px] pointer-events-none"></div>

              <div className="relative z-10 h-full flex flex-col justify-center items-center text-[#1a1a1a]">
                <h2 className="font-cartoon text-4xl md:text-5xl mb-6 text-center transform -rotate-2 underline decoration-[3px] decoration-black/60" style={{ textDecorationSkipInk: "none" }}>
                  SIZE CHART
                </h2>
                
                <table className="w-full text-center font-cartoon text-xl md:text-3xl border-collapse">
                  <thead>
                    <tr className="border-b-[3px] border-black/50">
                      <th className="pb-2 font-normal">SIZE</th>
                      <th className="pb-2 font-normal">CHEST</th>
                      <th className="pb-2 font-normal">LENGTH</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b-[2px] border-black/20">
                      <td className="py-3 font-bold">S</td>
                      <td className="py-3">22"</td>
                      <td className="py-3">28"</td>
                    </tr>
                    <tr className="border-b-[2px] border-black/20">
                      <td className="py-3 font-bold">M</td>
                      <td className="py-3">24"</td>
                      <td className="py-3">29"</td>
                    </tr>
                    <tr className="border-b-[2px] border-black/20">
                      <td className="py-3 font-bold">L</td>
                      <td className="py-3">26"</td>
                      <td className="py-3">30"</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold">XL</td>
                      <td className="py-3">28"</td>
                      <td className="py-3">31"</td>
                    </tr>
                  </tbody>
                </table>

                <p className="font-cartoon text-lg md:text-xl text-black/70 mt-8 text-center rotate-1 leading-tight">
                  * MEASURED IN INCHES.<br/>OVERSIZED FIT SO DON'T CRY IF IT'S BIG.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
