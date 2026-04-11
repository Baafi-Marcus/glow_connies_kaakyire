"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppImage from "@/components/AppImage";
import { Product } from "@/context/CartContext";
import { 
  ArrowRightIcon, 
  TruckIcon, 
  ChatBubbleLeftRightIcon, 
  SparklesIcon,
  ShoppingBagIcon,
  StarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  HandThumbUpIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import GlowLogo from "@/components/GlowLogo";

export default function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.ok ? res.json() : [])
      .then(data => setFeaturedProducts(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setFeaturedProducts([]));
  }, []);

  return (
    <div className="flex flex-col gap-0 -mt-8">
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AppImage 
            src="/dark_luxury_beauty_hero_1775936139115.png" 
            alt="Luxury Beauty Background"
            fill
            priority
            className="brightness-[0.6] scale-100 animate-slow-zoom object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>
        
        <div className="relative z-10 px-8 text-center text-white max-w-4xl space-y-12">
          <div className="flex justify-center animate-fade-in-up [animation-delay:200ms]">
            <span className="px-6 py-2 rounded-full border border-white/20 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.4em] bg-white/5 text-brand-rosegold shadow-2xl">
              Curated for the Sophisticated
            </span>
          </div>

          <div className="space-y-6 animate-fade-in-up [animation-delay:600ms]">
            <h1 className="text-6xl md:text-8xl font-serif leading-[1.1] tracking-tight">
              Pure <span className="italic">Radiance</span> <br /> 
              <span className="text-brand-rosegold">Defined.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              Experience a bespoke collection of international perfumes, designer accessories, and couture cosmetics in the heart of Ghana.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up [animation-delay:1000ms]">
            <Link 
              href="/products" 
              className="group w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-2xl hover:bg-white hover:text-black transition-all duration-700 flex items-center justify-center gap-2"
            >
              Explore Collection <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
            <button 
              onClick={() => window.open(`https://wa.me/233246702043`, '_blank')}
              className="w-full sm:w-auto px-12 py-6 bg-whatsapp text-white font-black uppercase tracking-widest text-xs rounded-full shadow-xl hover:scale-105 transition-all duration-500 flex items-center justify-center gap-3 animate-whatsapp-pulse"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/></svg> 
              Order on WhatsApp
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="w-px h-16 bg-white" />
        </div>
      </section>

      {/* 2. TRUST BADGES */}
      <section className="bg-white dark:bg-[#1E1E1E] py-16 px-6 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { icon: ShieldCheckIcon, title: "100% Authentic", desc: "Genuine Global Brands" },
            { icon: CreditCardIcon, title: "Secure Checkout", desc: "Safe Mobile Money Payments" },
            { icon: TruckIcon, title: "Fast Shipping", desc: "Door-to-door Delivery" },
            { icon: ChatBubbleLeftRightIcon, title: "Expert Support", desc: "24/7 WhatsApp Chat" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-3 group">
              <div className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-800 group-hover:bg-brand-rosegold/10 transition-colors">
                <item.icon className="w-8 h-8 text-brand-rosegold" />
              </div>
              <h4 className="font-bold text-sm uppercase tracking-wider">{item.title}</h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY EXPLORER */}
      <section className="py-24 px-6 bg-gray-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Shop Categories</h2>
            <div className="w-20 h-1 bg-brand-rosegold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Perfumes", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80", count: "48 Items", badge: "Best Seller" },
              { name: "Handbags", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80", count: "24 Items", badge: "New Trend" },
              { name: "Cosmetics", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80", count: "36 Items", badge: "Exclusive" }
            ].map((cat) => (
              <Link 
                key={cat.name} 
                href={`/products?category=${cat.name === 'Handbags' ? 'Accessories' : cat.name}`}
                className="group relative h-96 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                <AppImage src={cat.img} alt={cat.name} fill className="group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-brand-plum z-10">
                  {cat.badge}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-rosegold">{cat.count}</span>
                  <h3 className="text-3xl font-serif italic tracking-wide">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5 HOW IT WORKS (THE GLOW JOURNEY) */}
      <section className="py-32 px-6 bg-brand-plum dark:bg-[#150212] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
             <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-rosegold">The Experience</span>
                <h2 className="text-5xl md:text-7xl font-serif italic leading-tight">Your Journey <br /> to <span className="text-brand-rosegold">Radiance.</span></h2>
             </div>
             <p className="text-white/60 text-lg font-light leading-relaxed max-w-lg">
                We've refined the luxury shopping experience for Ghana. Simple, personalized, and delivered with care.
             </p>
             <Link 
              href="/products" 
              className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] group hover:text-brand-rosegold transition-colors"
             >
                Start Exploring <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {[
              { step: "01", title: "Select Your Signature", desc: "Discover premium perfumes, cosmetics, and accessories curated for you." },
              { step: "02", title: "Verify via WhatsApp", desc: "Connect with us to finalize your order and delivery details with ease." },
              { step: "03", title: "Receive Your Glow", desc: "Enjoy bespoke delivery across Ghana and elevate your daily lifestyle." }
            ].map((item, idx) => (
              <div key={idx} className="group flex gap-8 p-10 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-brand-rosegold/50 transition-all duration-500">
                 <span className="text-4xl font-serif italic text-brand-rosegold/30 group-hover:text-brand-rosegold transition-colors">{item.step}</span>
                 <div className="space-y-2">
                    <h4 className="text-xl font-bold tracking-tight">{item.title}</h4>
                    <p className="text-white/40 font-light leading-relaxed group-hover:text-white/60 transition-colors uppercase text-[10px] tracking-widest">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight">The Glow Edit</h2>
              <p className="text-gray-500 max-w-md">Our most refined pieces this week, curated for your radiant lifestyle in Ghana.</p>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-brand-plum dark:text-brand-rosegold">
              View Collection <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {featuredProducts.map(product => (
              <Link key={product.id} href="/products" className="group space-y-6">
                <div className="relative h-64 md:h-80 rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800/20">
                  <AppImage src={product.imageUrl} alt={product.name} fill className="group-hover:scale-110 transition-transform duration-1000" />
                  
                  {/* Badge */}
                  {product.badgeLabel && (
                    <div className="absolute top-4 left-4 bg-brand-plum text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest z-10 shadow-xl">
                      {product.badgeLabel}
                    </div>
                  )}

                  <div className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <ShoppingBagIcon className="w-5 h-5 text-brand-plum" />
                  </div>
                </div>
                <div className="px-2 space-y-1">
                  <h4 className="font-bold text-lg leading-tight line-clamp-1">{product.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <p className="text-brand-rosegold font-black tracking-widest text-xs uppercase">GHC {product.price}</p>
                    {product.oldPrice && (
                        <p className="text-[10px] text-gray-400 line-through font-bold">GHC {product.oldPrice}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLIENT REVIEWS */}
      <section className="py-24 px-6 bg-gray-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-5xl font-serif tracking-tight italic">Radiance Shared</h2>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-rosegold">What our clients say</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ama Serwaa", city: "Accra", text: "The quality of the perfumes is unmatched. Every scent I've ordered has been 100% authentic and the delivery was incredibly fast!", stars: 5 },
              { name: "Kofi Owusu", city: "Kumasi", text: "I bought a handbag for my wife and she absolutely loves it. The process on WhatsApp was smooth and very professional.", stars: 5 },
              { name: "Naa Ayeley", city: "Tema", text: "Glow by Connie is my go-to for cosmetics. The selection is premium and I love that I can chat directly with the team.", stars: 5 }
            ].map((review, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 hover:-translate-y-2 transition-transform duration-500">
                <div className="flex gap-1">
                  {[...Array(review.stars)].map((_, i) => <StarIconSolid key={i} className="w-4 h-4 text-brand-rosegold" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic font-light leading-relaxed">"{review.text}"</p>
                <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                   <span className="font-bold text-sm tracking-tight">{review.name}</span>
                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{review.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. READY TO GLOW CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <AppImage src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80" alt="Footer Background" fill className="opacity-[0.03] dark:opacity-[0.07] grayscale" />
        </div>
        <div className="max-w-3xl mx-auto space-y-12 relative z-10">
          <h2 className="text-5xl md:text-8xl font-serif leading-none italic tracking-tighter text-brand-plum dark:text-brand-rosegold">Ready to <br /> Glow?</h2>
          <p className="text-gray-500 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">Join thousand of women in Ghana who choose Glow by Connie for their premium beauty needs.</p>
          <div className="pt-6">
            <button 
              onClick={() => window.open(`https://wa.me/233246702043`, '_blank')}
              className="px-14 py-6 bg-whatsapp text-white font-black uppercase tracking-[0.2em] text-sm rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 mx-auto animate-whatsapp-pulse"
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/></svg> 
              Order on WhatsApp
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
