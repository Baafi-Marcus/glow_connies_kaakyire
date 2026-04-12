"use client";

import { XMarkIcon, ChatBubbleLeftRightIcon, CheckBadgeIcon, ShieldCheckIcon, TruckIcon } from "@heroicons/react/24/outline";
import AppImage from "./AppImage";
import { Product } from "@/context/CartContext";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  const handleWhatsAppOrder = () => {
    const message = `Hello Glow by Connie, I'm interested in: ${product.name} (GHC ${product.price}). Here is the link: ${window.location.origin}/products?id=${product.id}`;
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
        
        {/* Left: Image Section */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-gray-50 dark:bg-gray-900 overflow-hidden group">
          <AppImage 
            src={product.imageUrl} 
            alt={product.name} 
            fill 
            className="object-contain p-8 md:p-20 group-hover:scale-105 transition-transform duration-1000" 
          />
          {product.badgeLabel && (
            <div className="absolute top-10 left-10 bg-brand-plum text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[.4em] shadow-2xl z-20">
              {product.badgeLabel}
            </div>
          )}
          <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-4">
             <div className="h-0.5 w-12 bg-brand-rosegold" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-rosegold opacity-50">Authentic Luxury</span>
          </div>
        </div>

        {/* Right: Content Section */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto custom-scrollbar p-8 md:p-20 flex flex-col justify-between">
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-full hover:rotate-90 transition-transform z-30"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-brand-rosegold uppercase tracking-[0.4em]">{product.category}</span>
                <CheckBadgeIcon className="w-4 h-4 text-brand-rosegold" />
              </div>
              <h2 className="text-4xl md:text-6xl font-serif leading-[1.1] tracking-tight">{product.name}</h2>
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-4xl md:text-5xl font-serif italic text-brand-plum dark:text-brand-rosegold">GHC {product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through font-bold">GHC {product.oldPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400 font-light text-lg leading-relaxed">
                {product.description || "Indulge in the finest selection from Glow by Connie. This piece represents our commitment to elegance, quality, and your radiant lifestyle. Authenticated and curated specifically for our discerning clientele in Ghana."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50">
                  <ShieldCheckIcon className="w-6 h-6 text-brand-rosegold" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight">100% Guaranteed <br /> Authentic</span>
               </div>
               <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-gray-800/50">
                  <TruckIcon className="w-6 h-6 text-brand-rosegold" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Same Day <br /> Delivery (Accra)</span>
               </div>
            </div>
          </div>

          <div className="pt-12 md:pt-20">
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-whatsapp text-white py-8 rounded-[2.5rem] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-2xl shadow-whatsapp/20 active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <ChatBubbleLeftRightIcon className="w-6 h-6 relative z-10" />
              <span className="font-black uppercase tracking-[0.3em] text-sm relative z-10">Order via WhatsApp</span>
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-[0.2em]">Contact our personal shoppers for sizing & availability</p>
          </div>
        </div>
      </div>
    </div>
  );
}
