"use client";

import { XMarkIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon, ShieldCheckIcon, TruckIcon, ChevronLeftIcon, ChevronRightIcon, PlayCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import AppImage from "./AppImage";
import { Product, ProductVariant, useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Set initial state when product opens
  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setActiveMediaIndex(0);
    }
  }, [product]);

  if (!product) return null;

  // Compile all media: imageUrl, then images, then video
  const mediaList = [];
  if (product.imageUrl) mediaList.push({ type: 'image', url: product.imageUrl });
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      // Avoid duplicate of main image
      if (img !== product.imageUrl) mediaList.push({ type: 'image', url: img });
    });
  }
  if (product.videoUrl) mediaList.push({ type: 'video', url: product.videoUrl });

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeOldPrice = selectedVariant ? selectedVariant.oldPrice : product.oldPrice;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  
  const isOutOfStock = activeStock <= 0;

  const handleWhatsAppOrder = () => {
    const variantInfo = selectedVariant ? ` (Variant: ${selectedVariant.name})` : '';
    const message = `Hello Glow by Connie, I'm interested in: ${product.name}${variantInfo} (GHC ${activePrice}). Here is the link: ${window.location.origin}/products?id=${product.id}`;
    window.open(`https://wa.me/233246702043?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-plum/60 backdrop-blur-2xl transition-opacity animate-in fade-in duration-500" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-[#0A0A0A] w-full max-w-6xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
        
        {/* Left: Media Gallery Section */}
        <div className="relative w-full md:w-1/2 h-[45vh] md:h-full bg-gray-50 dark:bg-gray-900 group flex flex-col">
          
          {/* Main Media Display Viewport */}
          <div className="relative flex-1 w-full overflow-hidden">
            {mediaList.length > 0 && mediaList[activeMediaIndex].type === 'video' ? (
              <video 
                src={mediaList[activeMediaIndex].url}
                controls
                autoPlay
                className="w-full h-full object-cover md:object-contain absolute inset-0"
              />
            ) : mediaList.length > 0 ? (
              <AppImage 
                src={mediaList[activeMediaIndex].url} 
                alt={product.name} 
                fill 
                className="object-contain p-8 md:p-20 transition-all duration-700" 
              />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">No Image</div>
            )}
            
            {product.badgeLabel && (
              <div className="absolute top-10 left-10 bg-brand-plum text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[.4em] shadow-2xl z-20">
                {product.badgeLabel}
              </div>
            )}

            {/* Carousel Controls Overlay */}
            {mediaList.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(prev => prev === 0 ? mediaList.length - 1 : prev - 1) }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all text-gray-800 hidden md:block"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(prev => prev === mediaList.length - 1 ? 0 : prev + 1) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all text-gray-800 hidden md:block"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Row */}
          {mediaList.length > 1 && (
            <div className="h-24 md:h-32 w-full bg-gray-100/50 dark:bg-black/20 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 flex gap-2 overflow-x-auto items-center px-6 custom-scrollbar">
              {mediaList.map((media, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeMediaIndex === idx ? 'border-brand-plum scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  {media.type === 'video' ? (
                     <div className="w-full h-full bg-black flex items-center justify-center">
                        <PlayCircleIcon className="w-8 h-8 text-white opacity-80" />
                     </div>
                  ) : (
                     <AppImage src={media.url} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Content Section */}
        <div className="w-full md:w-1/2 h-[55vh] md:h-full overflow-y-auto custom-scrollbar p-6 md:p-14 lg:p-20 flex flex-col justify-between">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-full hover:rotate-90 transition-transform z-30"
          >
            <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="space-y-8 md:space-y-10">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-brand-rosegold uppercase tracking-[0.4em]">{product.category}</span>
                <CheckBadgeIcon className="w-4 h-4 text-brand-rosegold" />
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.1] tracking-tight">{product.name}</h2>
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-brand-plum dark:text-brand-rosegold">GHC {activePrice.toLocaleString()}</span>
                {activeOldPrice && (
                  <span className="text-sm md:text-lg text-gray-400 line-through font-bold">GHC {activeOldPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Select Option</h4>
                 <div className="flex flex-wrap gap-3">
                   {product.variants.map((variant) => (
                     <button
                       key={variant.id}
                       onClick={() => setSelectedVariant(variant)}
                       className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                         selectedVariant?.id === variant.id 
                          ? 'border-brand-plum bg-brand-plum text-white shadow-lg shadow-brand-plum/20' 
                          : 'border-gray-200 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-300 hover:border-brand-rosegold'
                       }`}
                     >
                       <div className="flex flex-col items-start gap-0.5">
                         <span>{variant.name}</span>
                         {variant.stock <= 0 && <span className="text-[8px] uppercase tracking-widest opacity-60">Out of stock</span>}
                       </div>
                     </button>
                   ))}
                 </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400 font-light text-base md:text-lg leading-relaxed">
                {product.description || "Indulge in the finest selection from Glow by Connie. This piece represents our commitment to elegance, quality, and your radiant lifestyle."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-center gap-4 p-4 md:p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50">
                  <ShieldCheckIcon className="w-5 h-5 md:w-6 md:h-6 text-brand-rosegold" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-tight">100% Guaranteed <br /> Authentic</span>
               </div>
               <div className="flex items-center gap-4 p-4 md:p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50">
                  <TruckIcon className="w-5 h-5 md:w-6 md:h-6 text-brand-rosegold" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-tight">Same Day <br /> Delivery (Accra)</span>
               </div>
            </div>
          </div>

          <div className="pt-8 md:pt-12 mt-auto flex flex-col gap-4">
            <button 
              onClick={() => {
                addToCart(product, selectedVariant);
                setIsCartOpen(true);
                onClose();
              }}
              disabled={isOutOfStock}
              className={`w-full py-5 md:py-6 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all shadow-xl group ${
                isOutOfStock 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                  : 'bg-brand-plum text-white dark:bg-brand-rosegold dark:text-black hover:scale-[1.02] active:scale-95'
              }`}
            >
              <ShoppingBagIcon className="w-5 h-5 md:w-6 md:h-6" />
              <span className="font-black uppercase tracking-[0.3em] text-xs md:text-sm">
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </span>
            </button>
            
            <button 
              onClick={handleWhatsAppOrder}
              disabled={isOutOfStock}
              className={`w-full py-5 md:py-6 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all bg-transparent border-2 overflow-hidden group ${
                isOutOfStock 
                  ? 'border-gray-200 dark:border-gray-800 text-gray-400 cursor-not-allowed' 
                  : 'border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white active:scale-95'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 md:w-6 md:h-6 relative z-10" />
              <span className="font-black uppercase tracking-[0.3em] text-xs md:text-sm relative z-10">
                Order via WhatsApp
              </span>
            </button>
            <p className="text-center text-[9px] md:text-[10px] text-gray-400 mt-4 md:mt-6 uppercase tracking-[0.2em]">Contact our personal shoppers for sizing & availability</p>
          </div>
        </div>
      </div>
    </div>
  );
}
