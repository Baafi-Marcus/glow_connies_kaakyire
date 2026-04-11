"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBagIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/admin/login', { 
        method: 'POST', 
        body: JSON.stringify({ password }) 
      });
      
      if (res.ok) { 
        router.push('/Kaakyire');
        router.refresh();
      } else {
        alert("Invalid credentials Access Denied.");
      }
    } catch (error) {
       alert("System authentication error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-black p-6">
      <div className="bg-white dark:bg-[#1E1E1E] p-12 rounded-[3rem] shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="w-24 h-24 bg-brand-plum/5 dark:bg-brand-rosegold/5 rounded-[2rem] flex items-center justify-center mx-auto relative group">
          <div className="absolute inset-0 bg-brand-rosegold dark:bg-brand-plum opacity-10 rounded-[2rem] group-hover:scale-110 transition-transform duration-500"></div>
          <ShoppingBagIcon className="w-12 h-12 text-brand-plum dark:text-brand-rosegold relative" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-serif text-brand-plum dark:text-brand-rosegold tracking-tight">Admin Portal</h2>
          <p className="text-gray-500 font-light tracking-wide">Enter your credentials to manage Glow By Connie</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-brand-rosegold transition-colors" />
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="System Password" 
              required 
              className="w-full pl-14 pr-6 py-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-4 focus:ring-brand-rosegold/10 focus:border-brand-rosegold outline-none transition-all duration-300"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-plum dark:bg-brand-rosegold text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs py-6 rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Validating..." : "Unlock Dashboard"}
          </button>
        </form>
        
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
           Glow By Connie — Secure Admin
        </p>
      </div>
    </div>
  );
}
