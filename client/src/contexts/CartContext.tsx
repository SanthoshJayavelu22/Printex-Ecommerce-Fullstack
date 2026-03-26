'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    mainImage: string;
    images?: string[];
    stock: number;
    minOrderQuantity: number;
  };
  quantity: number;
  selectedSize?: string;
  selectedShape?: string;
  selectedMaterial?: string;
  selectedFinish?: string;
  designUrl?: string;
  needsDesign?: boolean;
  itemTotal: number;
  unavailable?: boolean;
}

interface Cart {
  items: CartItem[];
  bill: number;
  totalItems: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (itemData: any) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart({ items: [], bill: 0, totalItems: 0 });
      setLoading(false);
    }
  }, [user]);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const { data } = await fetchApi('/cart');
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemData: any) => {
    try {
      if (!user) {
        throw new Error('Please login to add items to cart');
      }
      
      const options: any = {
        method: 'POST',
      };

      if (itemData instanceof FormData) {
        options.body = itemData;
      } else {
        options.body = JSON.stringify(itemData);
      }

      const { data } = await fetchApi('/cart', options);
      setCart(data);
    } catch (err: any) {
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { data } = await fetchApi(`/cart/${itemId}`, {
        method: 'DELETE',
      });
      setCart(data);
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const { data } = await fetchApi(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      setCart(data);
    } catch (err: any) {
      throw err;
    }
  };

  const clearCart = () => {
    setCart({ items: [], bill: 0, totalItems: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
