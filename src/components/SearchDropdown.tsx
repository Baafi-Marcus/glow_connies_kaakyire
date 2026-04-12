"use client";

import { XMarkIcon, MagnifyingGlassIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { useCart, Product } from "@/context/CartContext";
import AppImage from "./AppImage";
import { useRouter } from "next/navigation";

export default function SearchDropdown() {
  const { isSearchOpen, setIsSearchOpen, searchQuery: query, setSearchQuery: setQuery } = useCart();
  const [localMatches, setLocalMatches] = useState<Product[]>([]);
  const [alternativeSuggestion, setAlternativeSuggestion] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load products for instant local search
  useEffect(() => {
    if (isSearchOpen) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setAllProducts(Array.isArray(data) ? data : []));
    } else {
        setQuery("");
        setLocalMatches([]);
        setAlternativeSuggestion(null);
    }
  }, [isSearchOpen]);

  // Local Search + Background Intelligent discovery
  useEffect(() => {
    if (!query.trim()) {
      setLocalMatches([]);
      setAlternativeSuggestion(null);
      return;
    }

    const q = query.toLowerCase();
    const results = allProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      (q.includes("men") && (p.description.toLowerCase().includes("men") || p.name.toLowerCase().includes("men"))) ||
      (q.includes("woman") && (p.description.toLowerCase().includes("woman") || p.name.toLowerCase().includes("woman")))
    );

    setLocalMatches(results.slice(0, 5));

    // Automated Background Search (Silent Intelligence)
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (results.length < 3) {
      searchTimeout.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const res = await fetch('/api/products/search/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          });
          const data = await res.json();
          if (data.matches && data.matches.length > 0) {
            const extraProducts = allProducts.filter(p => data.matches.includes(p.id));
            setLocalMatches(prev => {
                const combined = [...prev, ...extraProducts.filter(ep => !prev.find(p => p.id === ep.id))];
                return combined.slice(0, 5);
            });
          }
          setAlternativeSuggestion(data.suggestion || null);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      }, 1000); // 1s delay for silent search
    }
  }, [query, allProducts]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-x-0 top-[72px] bottom-0 z-[40] flex flex-col pointer-events-none">
      {/* Backdrop */}
      <div 
         className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-500 pointer-events-auto"
         onClick={() => setIsSearchOpen(false)}
      />

      {/* Dropdown Content */}
      <div className="relative w-full bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-3xl border-b border-gray-100 dark:border-gray-900 shadow-2xl animate-in slide-in-from-top-4 duration-500 pointer-events-auto max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-6 py-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Suggestions Section */}
                <div className="lg:col-span-4 space-y-10 border-r border-gray-50 dark:border-gray-900 pr-10 hidden lg:block">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Quick Filters</h4>
                        <div className="flex flex-col gap-3">
                            {["Newest Arrivals", "Perfumes for Men", "Luxury Accessories", "Bestsellers"].map(text => (
                                <button key={text} className="text-left py-2 hover:translate-x-2 transition-transform hover:text-brand-rosegold text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Results section */}
                <div className="lg:col-span-8">
                    {!query ? (
                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Trending Discoveries</h4>
                            <div className="flex flex-wrap gap-4">
                                {["Oud Intense", "Leather Bags", "Gifts for Her", "Watches"].map(tag => (
                                    <button 
                                        key={tag}
                                        onClick={() => setQuery(tag)}
                                        className="px-8 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full text-xs font-bold hover:border-brand-rosegold transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                                    {isSearching ? "Searching..." : `${localMatches.length} Matches Found`}
                                </h4>
                            </div>

                            {alternativeSuggestion && (
                                <div className="p-6 bg-brand-rosegold/5 border border-brand-rosegold/20 rounded-3xl italic font-serif text-brand-plum dark:text-brand-rosegold text-sm">
                                    {alternativeSuggestion}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {localMatches.map(product => (
                                    <div 
                                        key={product.id}
                                        onClick={() => {
                                            setIsSearchOpen(false);
                                            router.push(`/products?category=${product.category}`);
                                        }}
                                        className="group flex gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                    >
                                        <div className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0">
                                            <AppImage src={product.imageUrl} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center gap-1 min-w-0">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-brand-rosegold">{product.category}</span>
                                            <h4 className="text-sm font-bold truncate group-hover:text-brand-plum transition-colors">{product.name}</h4>
                                            <p className="text-[10px] font-serif italic text-gray-400">{product.price.toLocaleString()} GHC</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!isSearching && localMatches.length === 0 && (
                                <div className="py-20 text-center">
                                    <p className="text-gray-400 italic">No direct matches found. Try a different term or browse our categories.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}
