"use client";

import { XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { name: string; count: number }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeSort: string;
  onSortChange: (sort: string) => void;
  priceRange: [number, number];
  currentPriceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  totalProducts: number;
}

const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "newest", label: "Newest First" },
  { id: "price_low", label: "Price: Low to High" },
  { id: "price_high", label: "Price: High to Low" },
  { id: "top_rated", label: "Top Rated" }
];

export default function FilterDrawer({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onCategoryChange,
  activeSort,
  onSortChange,
  priceRange,
  currentPriceRange,
  onPriceChange,
  totalProducts
}: FilterDrawerProps) {
  const [localPrice, setLocalPrice] = useState(currentPriceRange[1]);

  useEffect(() => {
    setLocalPrice(currentPriceRange[1]);
  }, [currentPriceRange]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
         className="absolute inset-0 bg-brand-plum/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-500"
         onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#0A0A0A] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="p-10 flex items-center justify-between border-b border-gray-50 dark:border-gray-900">
          <h2 className="text-3xl font-serif italic">Filters</h2>
          <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full hover:rotate-90 transition-transform">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
          
          {/* SORT BY */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Sort By</h4>
            <div className="flex flex-col gap-3">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => onSortChange(option.id)}
                  className={`flex items-center justify-between p-6 rounded-3xl transition-all border ${
                    activeSort === option.id 
                      ? "bg-brand-plum text-white border-brand-plum shadow-xl shadow-brand-plum/20" 
                      : "bg-gray-50 dark:bg-gray-800/40 border-transparent text-gray-600 dark:text-gray-400 hover:border-brand-rosegold/30"
                  }`}
                >
                  <span className="font-bold tracking-tight text-sm">{option.label}</span>
                  {activeSort === option.id && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Category</h4>
             <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => onCategoryChange(cat.name)}
                    className={`flex items-center justify-between py-4 px-2 group transition-all ${
                      activeCategory === cat.name ? "text-brand-plum dark:text-brand-rosegold" : "text-gray-500"
                    }`}
                  >
                    <span className={`text-lg transition-transform ${activeCategory === cat.name ? "translate-x-2 font-bold" : "group-hover:translate-x-2"}`}>
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-black px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
                      {cat.count}
                    </span>
                  </button>
                ))}
             </div>
          </div>

          {/* PRICE RANGE */}
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Price Range (₵)</h4>
              <div className="text-xl font-serif italic text-brand-plum dark:text-brand-rosegold">₵0 - ₵{localPrice.toLocaleString()}</div>
            </div>
            <div className="px-2">
              <input 
                type="range" 
                min={priceRange[0]} 
                max={priceRange[1]} 
                step={10}
                value={localPrice}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setLocalPrice(val);
                  onPriceChange([priceRange[0], val]);
                }}
                className="w-full accent-brand-plum dark:accent-brand-rosegold h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full cursor-pointer appearance-none transition-all"
              />
              <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>₵{priceRange[0]}</span>
                <span>₵{priceRange[1]}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-10 border-t border-gray-50 dark:border-gray-900">
           <button 
             onClick={onClose}
             className="w-full py-8 bg-brand-plum text-white dark:bg-brand-rosegold dark:text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl hover:scale-[1.02] transition-all active:scale-95"
           >
             View {totalProducts} Products
           </button>
           <button 
              onClick={() => {
                onCategoryChange("All");
                onSortChange("popular");
                onPriceChange(priceRange);
              }}
              className="w-full mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-plum transition-colors"
           >
             Clear All Filters
           </button>
        </div>

      </div>
    </div>
  );
}
