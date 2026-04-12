"use client";

import { useState } from "react";
import { XMarkIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart, CartItem } from "@/context/CartContext";

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  location: string;
  items: CartItem[];
  totalAmount: number;
};

export default function CartDrawer() {
  const { cart, removeFromCart, cartTotal, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  
  // Customer details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("Greater Accra");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  const GH_REGIONS = [
    "Greater Accra", "Ashanti", "Central", "Eastern", "Western", 
    "Western North", "Volta", "Oti", "Northern", "Savannah", 
    "North East", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo"
  ];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const orderData = { 
      customerName: name, 
      customerPhone: phone, 
      location: `${region} | ${location}`, 
      items: cart, 
      totalAmount: cartTotal 
    };
    try {
      const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) });
      const order = await res.json();
      
      setSubmittedOrder(order);
      clearCart();
    } catch(err) {
      alert("Failed to submit order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectToWhatsApp = () => {
    if (!submittedOrder) return;
    
    let message = `*🌟 NEW ORDER - GLOW BY CONNIE*\n`;
    message += `--------------------------\n`;
    message += `*🆔 Ref:* #${submittedOrder.id.slice(-5).toUpperCase()}\n`;
    message += `*👤 Customer:* ${submittedOrder.customerName}\n`;
    message += `*📱 Phone:* ${submittedOrder.customerPhone}\n`;
    message += `*📍 Location:* ${submittedOrder.location}\n`;
    message += `--------------------------\n\n`;
    message += `*🛍️ ITEMS:*\n`;
    submittedOrder.items.forEach((item: CartItem) => {
      message += `• ${item.name} x${item.quantity}\n`;
    });
    message += `\n--------------------------\n`;
    message += `*💰 TOTAL:* GHC ${submittedOrder.totalAmount}\n`;
    message += `--------------------------\n`;
    message += `_I&apos;ve received my order reference. Please send your MOMO details to finalize!_`;
    
    const whatsappParams = new URLSearchParams({ text: message });
    window.open(`https://wa.me/233246702043?${whatsappParams.toString()}`, '_blank');
    
    // Close everything
    setSubmittedOrder(null);
    setIsCheckout(false);
    setIsCartOpen(false);
    setName(""); setPhone(""); setLocation("");
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`fixed inset-y-0 right-0 w-[85%] max-w-md bg-white dark:bg-[#1E1E1E] z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="w-6 h-6 text-brand-plum dark:text-brand-rosegold" />
            <h2 className="text-xl font-serif font-bold">My Cart ({cart.length})</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {submittedOrder ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor font-black"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
               </div>
               
               <div className="space-y-2">
                 <h3 className="text-3xl font-serif italic text-brand-plum dark:text-brand-rosegold">Order Logged!</h3>
                 <p className="text-gray-500 font-light px-6 line-clamp-2">Your collection has been reserved. Finalize payment on WhatsApp to start delivery.</p>
               </div>

               <div className="w-full p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Reference ID</span>
                    <span>Status</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black tracking-tighter">#{submittedOrder.id.slice(-5).toUpperCase()}</span>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-yellow-200">Pending MOMO</span>
                  </div>
               </div>

               <button 
                 onClick={redirectToWhatsApp}
                 className="w-full bg-[#25D366] hover:bg-[#1ebd5c] text-white font-black uppercase tracking-widest text-xs py-6 rounded-2xl shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/></svg>
                 Open WhatsApp to Finalize
               </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
                <ShoppingBagIcon className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Your cart is empty</h3>
                <p className="text-gray-500 text-sm mt-1">Looks like you haven&apos;t added any glow yet.</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="bg-brand-plum dark:bg-brand-rosegold text-white dark:text-black hover:opacity-90 px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 mt-4"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {!isCheckout ? (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">GHC {item.price} × {item.quantity}</p>
                        <p className="font-bold text-brand-plum dark:text-brand-rosegold mt-1">GHC {item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 leading-none">Full Name</label>
                    <input required className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" value={name} onChange={e => setName(e.target.value)} placeholder="Akosua Mensah" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 leading-none">WhatsApp Number</label>
                    <input required type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" value={phone} onChange={e => setPhone(e.target.value)} placeholder="024 XXX XXXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 leading-none">Region</label>
                    <select 
                      required 
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 appearance-none cursor-pointer" 
                      value={region} 
                      onChange={e => setRegion(e.target.value)}
                    >
                      {GH_REGIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1 leading-none">Delivery Location / House Address</label>
                    <textarea required className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" value={location} onChange={e => setLocation(e.target.value)} placeholder="House No, Landmark, Street name..." rows={3} />
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-brand-plum dark:text-brand-rosegold">GHC {cartTotal}</span>
            </div>
            
            {isCheckout ? (
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsCheckout(false)} className="flex-1 py-4 font-bold text-gray-500 hover:text-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors">Back</button>
                <button form="checkout-form" type="submit" className="flex-[2] bg-[#25D366] hover:bg-[#1ebd5c] text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                  Order via WhatsApp
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsCheckout(true)}
                className="w-full bg-brand-plum dark:bg-brand-rosegold text-white dark:text-black font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
