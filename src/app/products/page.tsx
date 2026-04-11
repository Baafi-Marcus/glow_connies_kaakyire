"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppImage from "@/components/AppImage";
import { useCart, Product } from "@/context/CartContext";
import { FunnelIcon, ShoppingBagIcon, PlusIcon } from "@heroicons/react/24/outline";

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';

    const url = category && category !== 'All' 
      ? `/api/products?category=${category}` 
      : '/api/products';
      
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const data = res.ok ? await res.json() : [];
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollection();
  }, [category]);

  return (
    <div className="w-full">
      {/* Search/Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-20 px-2">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-brand-rosegold font-bold uppercase tracking-widest text-xs mb-4">
            <span className="w-8 h-[1px] bg-brand-rosegold"></span>
            Our Collection
          </div>
          <h1 className="text-5xl md:text-8xl font-serif text-brand-plum dark:text-brand-rosegold mb-8 leading-[1.05] tracking-tight">
            {category === 'All' ? 'Everything' : category} <br />
            <span className="text-gray-300 dark:text-gray-700 italic font-medium">Beauty Tailored For You.</span>
          </h1>
        </div>
        <button className="flex items-center gap-3 px-10 py-6 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
          <FunnelIcon className="w-6 h-6 text-brand-rosegold group-hover:rotate-180 transition-transform duration-700" />
          <span className="font-black tracking-[0.2em] uppercase text-xs">Categories</span>
        </button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 h-[500px] rounded-[3rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {Array.isArray(products) && products.map(product => (
            <div key={product.id} className="group bg-white dark:bg-[#1E1E1E] rounded-[3rem] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-all duration-700 border border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="relative h-[22rem] bg-gray-50 dark:bg-gray-900 w-full overflow-hidden">
                <AppImage 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                
                {/* Marketing Badge */}
                {product.badgeLabel && (
                  <div className="absolute top-8 left-8 bg-brand-plum text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[.3em] shadow-2xl z-20">
                    {product.badgeLabel}
                  </div>
                )}

                <div className="absolute bottom-8 left-8 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 py-1.5 rounded-full text-[8px] font-black text-brand-plum dark:text-brand-rosegold uppercase tracking-[.3em] shadow-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-bold mb-3 group-hover:text-brand-rosegold transition-colors duration-300">{product.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-10 flex-1 line-clamp-2 text-sm leading-relaxed font-light">{product.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-1">GHC PRICE</span>
                    <div className="flex items-baseline gap-3">
                      <p className="font-black text-3xl text-brand-plum dark:text-brand-rosegold">{product.price.toLocaleString()}</p>
                      {product.oldPrice && (
                        <p className="text-sm text-gray-400 line-through font-bold">GHC {product.oldPrice.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <button 
                    className="inline-flex items-center justify-center h-16 w-16 rounded-[1.5rem] bg-brand-plum dark:bg-brand-rosegold text-white dark:text-black hover:rotate-90 hover:scale-110 transition-all duration-500 shadow-2xl active:scale-90" 
                    onClick={() => addToCart(product)}
                    title="Add to Bag"
                  >
                    <PlusIcon className="w-10 h-10" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-40 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
              <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-200 dark:text-gray-800 mb-8" />
              <h2 className="text-4xl font-serif text-gray-400 uppercase tracking-[0.2em] mb-4">Coming Soon</h2>
              <p className="text-gray-500 font-light text-xl">We&apos;re curating something special for you.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
