"use client";

import { XMarkIcon, MagnifyingGlassIcon, SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { useCart, Product } from "@/context/CartContext";
import AppImage from "./AppImage";
import { useRouter } from "next/navigation";

export default function SearchDrawer() {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState("");
  const [localMatches, setLocalMatches] = useState<Product[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load all products once for instant local search
  useEffect(() => {
    if (isSearchOpen) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setAllProducts(Array.isArray(data) ? data : []));
      
      // Auto-focus input
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [isSearchOpen]);

  // Robust Local Search (System)
  useEffect(() => {
    if (!query.trim()) {
      setLocalMatches([]);
      setAiSuggestion(null);
      return;
    }

    const q = query.toLowerCase();
    const results = allProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      // Smart intent keyword mapping
      (q.includes("men") && (p.description.toLowerCase().includes("men") || p.name.toLowerCase().includes("men"))) ||
      (q.includes("woman") && (p.description.toLowerCase().includes("woman") || p.name.toLowerCase().includes("woman")))
    );

    setLocalMatches(results.slice(0, 6)); // Top 6 matches
  }, [query, allProducts]);

  const handleDeepSearch = async () => {
    if (!query.trim()) return;
    setIsAiLoading(true);
    setAiSuggestion(null);

    try {
      const res = await fetch('/api/products/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();

      if (data.matches && data.matches.length > 0) {
        // Map ID matches back to full product objects
        const aiProducts = allProducts.filter(p => data.matches.includes(p.id));
        setLocalMatches(aiProducts);
      }
      setAiSuggestion(data.suggestion || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex flex-col items-center overflow-hidden">
      {/* Backdrop */}
      <div 
         className="absolute inset-0 bg-brand-plum/90 backdrop-blur-md transition-opacity animate-in fade-in duration-700"
         onClick={() => setIsSearchOpen(false)}
      />

      {/* Close Button Mobile */}
      <button 
        onClick={() => setIsSearchOpen(false)}
        className="absolute top-10 right-10 z-[260] p-4 bg-white/10 text-white rounded-full hover:bg-white/20 md:hidden"
      >
        <XMarkIcon className="w-8 h-8" />
      </button>

      {/* Search Container */}
      <div className="relative w-full max-w-5xl h-full md:h-auto md:mt-32 bg-transparent flex flex-col p-6 md:p-12 animate-in slide-in-from-top-12 duration-700 text-white">
        
        {/* Search Input Area */}
        <div className="relative group">
          <MagnifyingGlassIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 text-brand-rosegold" />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search for perfection..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDeepSearch()}
            className="w-full bg-transparent border-b-2 border-white/20 py-8 md:py-12 px-12 md:px-20 text-4xl md:text-7xl font-serif italic focus:outline-none focus:border-brand-rosegold transition-all placeholder:text-white/20"
          />
          {query && (
            <button 
              onClick={handleDeepSearch}
              disabled={isAiLoading}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-brand-rosegold text-black px-6 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-110 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
            >
              {isAiLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <SparklesIcon className="w-5 h-5" />
              )}
              {isAiLoading ? "Analyzing..." : "AI Intelligence"}
            </button>
          )}
        </div>

        {/* Results / Suggestions */}
        <div className="mt-12 md:mt-20 flex-1 overflow-y-auto custom-scrollbar no-scrollbar">
          
          {aiSuggestion && (
            <div className="mb-12 p-8 bg-brand-rosegold/10 border border-brand-rosegold/30 rounded-[2.5rem] flex items-start gap-6 animate-in slide-in-from-left duration-500">
               <SparklesIcon className="w-8 h-8 text-brand-rosegold shrink-0" />
               <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-brand-rosegold">
                 {aiSuggestion}
               </p>
            </div>
          )}

          {localMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {localMatches.map(product => (
                <div 
                  key={product.id}
                  onClick={() => {
                    setIsSearchOpen(false);
                    router.push(`/products?category=${product.category}`);
                  }}
                  className="group flex gap-6 p-4 rounded-[2rem] hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
                >
                  <div className="relative h-32 w-32 rounded-3xl overflow-hidden shrink-0">
                    <AppImage src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-rosegold">{product.category}</span>
                    <h4 className="text-2xl font-bold group-hover:text-brand-rosegold transition-colors">{product.name}</h4>
                    <p className="text-sm font-serif italic text-white/50">{product.price.toLocaleString()} GHC</p>
                  </div>
                </div>
              ))}
            </div>
          ) : query && !isAiLoading && (
            <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
               <h3 className="text-4xl md:text-6xl font-serif italic text-white/40 mb-8">We don't found that yet...</h3>
               <p className="text-xl text-white/60 mb-12">Maybe try searching for <span className="text-brand-rosegold italic">"Fresh Oud"</span> or <span className="text-brand-rosegold italic">"Handbags for Her"</span>?</p>
               <button 
                 onClick={handleDeepSearch}
                 className="px-12 py-6 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all"
               >
                 Ask the Intelligence Assistant
               </button>
            </div>
          )}

          {!query && (
             <div className="animate-in fade-in duration-700">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Quick Discovery</h4>
                <div className="flex flex-wrap gap-4">
                  {["Oud", "Perfumes", "Men", "Woman", "Accessories"].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all hover:-translate-y-1"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
             </div>
          )}

        </div>

      </div>
    </div>
  );
}
