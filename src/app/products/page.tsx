"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppImage from "@/components/AppImage";
import { useCart, Product } from "@/context/CartContext";
import { FunnelIcon, ShoppingBagIcon, PlusIcon, StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import ProductDetailModal from "@/components/ProductDetailModal";
import FilterDrawer from "@/components/FilterDrawer";
import { useRouter } from "next/navigation";

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'All';
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");
  
  // Advanced Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSort, setActiveSort] = useState("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 2000]);

  useEffect(() => {
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
    setActiveSubCategory("All");
  }, [category]);

  useEffect(() => {
    if (products.length > 0) {
      const maxPrice = Math.max(...products.map(p => p.price));
      const roundedMax = Math.ceil(maxPrice / 100) * 100;
      setPriceRange([0, roundedMax]);
      setCurrentPriceRange([0, roundedMax]);
    }
  }, [products]);

  const subCategories = ["All", ...Array.from(new Set(products.map(p => p.subCategory).filter(Boolean)))];

  // Helper for stable random ratings (hash based on product.id)
  const getProductRating = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = 4 + (hash % 11) / 10; // 4.0 to 5.0
    const reviews = 10 + (hash % 200);
    return { rating, reviews };
  };

  const filteredProducts = products.filter(p => {
    const matchesSub = activeSubCategory === "All" || p.subCategory === activeSubCategory;
    const matchesPrice = p.price >= currentPriceRange[0] && p.price <= currentPriceRange[1];
    return matchesSub && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeSort === "price_low") return a.price - b.price;
    if (activeSort === "price_high") return b.price - a.price;
    if (activeSort === "newest") return new Date(b.id).getTime() - new Date(a.id).getTime(); // Placeholder since we don't have createdAt, ID is usually sequential
    if (activeSort === "top_rated") return getProductRating(b.id).rating - getProductRating(a.id).rating;
    return 0; // popular
  });

  const categoryCounts = ["All", "Perfumes", "Accessories", "Beauty"].map(name => ({
    name,
    count: products.filter(p => name === "All" || p.category === name).length
  }));

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
        
        {category !== "All" && subCategories.length > 1 && (
          <div className="flex flex-wrap gap-3 mt-10 md:mt-16 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
            {subCategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubCategory(sub as string)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap border ${
                  activeSubCategory === sub 
                    ? "bg-brand-plum text-white border-brand-plum shadow-xl shadow-brand-plum/20" 
                    : "bg-transparent text-gray-500 border-gray-100 dark:border-gray-800 hover:border-brand-rosegold hover:text-brand-rosegold backdrop-blur-md"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-12 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Inventory Status</p>
          <h2 className="text-2xl font-serif italic text-brand-plum dark:text-brand-rosegold">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'} available
          </h2>
        </div>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-4 px-12 py-6 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-brand-rosegold/30 transition-all duration-500 group"
        >
          <FunnelIcon className="w-5 h-5 text-brand-rosegold group-hover:rotate-180 transition-transform duration-700" />
          <span className="font-black tracking-[0.2em] uppercase text-[10px]">Customize View</span>
        </button>
      </div>

      <FilterDrawer 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categoryCounts}
        activeCategory={category}
        onCategoryChange={(cat) => {
          if (cat === "All") router.push('/products');
          else router.push(`/products?category=${cat}`);
          setIsFilterOpen(false);
        }}
        activeSort={activeSort}
        onSortChange={(s) => {
          setActiveSort(s);
          setIsFilterOpen(false);
        }}
        priceRange={priceRange}
        currentPriceRange={currentPriceRange}
        onPriceChange={setCurrentPriceRange}
        totalProducts={sortedProducts.length}
      />
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 h-[500px] rounded-[3rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
          {Array.isArray(sortedProducts) && sortedProducts.map(product => {
            const { rating, reviews } = getProductRating(product.id);
            return (
              <div key={product.id} onClick={() => setSelectedProduct(product)} className="group flex flex-col cursor-pointer animate-in fade-in zoom-in-95 duration-700">
                <div className="relative h-[16rem] md:h-[26rem] bg-gray-50 dark:bg-[#121212] w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-gray-50 dark:border-gray-900 shadow-sm group-hover:shadow-2xl transition-all duration-700 group-hover:-translate-y-2">
                  <AppImage 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  
                  {/* Luxury Badges */}
                  <div className="absolute top-4 md:top-6 left-4 md:left-6 flex flex-col gap-2 z-20">
                    {product.badgeLabel && (
                      <div className="bg-brand-plum text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-[.2em] shadow-xl">
                        {product.badgeLabel}
                      </div>
                    )}
                    {product.oldPrice && (
                      <div className="bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-[.2em] shadow-xl">
                        HOT
                      </div>
                    )}
                  </div>

                  {/* Category Pill Over Image */}
                  <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 bg-white/80 dark:bg-black/80 backdrop-blur-md px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[8px] font-black text-brand-plum dark:text-brand-rosegold uppercase tracking-[.3em] shadow-sm">
                    {product.category}
                  </div>

                  {/* Circular Quick Add button on hover */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div 
                      className="bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-xl h-20 w-20 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500 flex items-center justify-center pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <PlusIcon className="w-10 h-10 text-brand-plum dark:text-brand-rosegold" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-8 px-1 md:px-2 space-y-2 md:space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(rating) ? 
                        <StarIcon key={i} className="w-3 h-3 md:w-4 md:h-4 text-brand-rosegold" /> : 
                        <StarOutline key={i} className="w-3 h-3 md:w-4 md:h-4 text-gray-300 dark:text-gray-700" />
                    ))}
                    <span className="text-[9px] md:text-[11px] font-bold text-gray-400 ml-1">({reviews})</span>
                  </div>

                  <h3 className="text-lg md:text-2xl font-bold line-clamp-1 group-hover:text-brand-plum dark:group-hover:text-brand-rosegold transition-colors duration-300">{product.name}</h3>
                  <p className="text-gray-400 text-[10px] md:text-xs line-clamp-1 italic font-light">{product.description}</p>
                  
                  <div className="pt-1 md:pt-2 flex items-baseline gap-2 md:gap-4">
                    <p className="font-serif italic text-xl md:text-3xl text-brand-plum dark:text-brand-rosegold font-bold">₵{product.price.toLocaleString()}</p>
                    {product.oldPrice && (
                      <p className="text-[10px] md:text-sm text-gray-400 line-through font-bold">₵{product.oldPrice.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {sortedProducts.length === 0 && (
            <div className="col-span-full py-40 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
              <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-200 dark:text-gray-800 mb-8" />
              <h2 className="text-4xl font-serif text-gray-400 uppercase tracking-[0.2em] mb-4">Coming Soon</h2>
              <p className="text-gray-500 font-light text-xl">We&apos;re curating something special for you.</p>
            </div>
          )}
        </div>
      )}

      <ProductDetailModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
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
