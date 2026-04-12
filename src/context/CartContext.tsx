"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  productId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  oldPrice?: number | null;
  imageUrl: string | null;
  images?: string[];
  videoUrl?: string | null;
  badgeLabel?: string | null;
  category: string;
  subCategory?: string | null;
  variants?: ProductVariant[];
};

export type CartItem = Product & { 
  quantity: number;
  selectedVariant?: ProductVariant | null;
  cartItemId: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, selectedVariant?: ProductVariant | null) => void;
  removeFromCart: (cartItemId: string) => void;
  cartTotal: number;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (product: Product, selectedVariant: ProductVariant | null = null) => {
    setCart((prev) => {
      const cartItemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedVariant, cartItemId }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const priceToUse = item.selectedVariant ? item.selectedVariant.price : item.price;
    return sum + priceToUse * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      cartTotal, 
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isMenuOpen,
      setIsMenuOpen,
      isSearchOpen,
      setIsSearchOpen,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
