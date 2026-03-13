'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  return (
    <>
      <Header />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-44 pb-20">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : cart && cart.items.length > 0 ? (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-44 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <ShoppingBag className="w-8 h-8 text-indigo-500" />
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Shopping Cart</h1>
              <span className="ml-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-full">
                {cart.totalItems} Items
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-8 space-y-4">
                {cart.items.map((item) => (
                  <div 
                    key={item._id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                  >
                    {item.unavailable && (
                      <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-950/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          Currently Unavailable
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Image */}
                      <div className="relative w-full sm:w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800 flex items-center justify-center p-2">
                        <img
                          src={item.designUrl ? getImageUrl(item.designUrl) : getImageUrl(item.product?.mainImage)}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                              {item.product?.name}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tight font-semibold">
                              {item.selectedSize && `${item.selectedSize}`} 
                              {item.selectedFinish && ` • ${item.selectedFinish}`}
                            </p>
                            {item.needsDesign && (
                              <div className="mt-2 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                                Pro Design Needed
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-slate-400 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= (item.product?.minOrderQuantity || 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors disabled:opacity-30"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-slate-700 dark:text-slate-200">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={item.quantity >= (item.product?.stock || 999)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors disabled:opacity-30"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5 uppercase tracking-widest font-black">Price</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white italic">
                               ₹{(item.itemTotal || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden lg:sticky lg:top-[110px] h-fit">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                  
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900 dark:text-white italic">₹{(cart?.bill || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Shipping Fee</span>
                      <span className="text-green-500 font-black uppercase tracking-widest text-[10px]">FREE</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
                    <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                      <span>Total Bill</span>
                      <span className="text-2xl text-indigo-600 dark:text-indigo-400 italic">₹{(cart?.bill || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link 
                      href="/checkout"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-500/25"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link 
                      href="/"
                      className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-4 rounded-2xl flex items-center justify-center transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  <div className="mt-8 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      <span>Secure checkout powered by Stripe</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <Truck className="w-5 h-5 text-indigo-500" />
                      <span>Free express delivery on all orders</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <RefreshCw className="w-5 h-5 text-indigo-500" />
                      <span>30-day money back guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-6 pt-20">
          <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-md">
            Looks like you haven't added anything to your cart yet. Let's find some premium products for you!
          </p>
          <Link 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
          >
            Start Shopping
          </Link>
        </div>
      )}
      <Footer />
    </>
  );
}

