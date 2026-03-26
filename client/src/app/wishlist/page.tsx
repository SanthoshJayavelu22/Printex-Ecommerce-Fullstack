"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchApi, getImageUrl } from '@/lib/api';
import { Heart, ShoppingBag, Trash2, Loader2, Package } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const fetchWishlist = async () => {
    try {
      const res = await fetchApi('/wishlist');
      if (res.success) {
        setWishlist(res.data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await fetchApi(`/wishlist/${productId}`, { method: 'POST' });
      setWishlist(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Wishlist</h1>
            <div className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/30">
              <Heart size={32} fill="currentColor" />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="font-bold text-slate-400 uppercase tracking-widest">Scanning items...</p>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                <Package className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 italic uppercase tracking-tight">Your wishlist is empty</h2>
                <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Save items you like to keep track of them and buy them later.</p>
                <Link href="/" className="bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Start Shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((product) => (
                <div key={product._id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
                   <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 relative p-10 flex items-center justify-center">
                      <img 
                        src={getImageUrl(product.mainImage)} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-[1.5s]" 
                      />
                      <button 
                        onClick={() => handleRemove(product._id)}
                        className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-slate-800 text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={20} />
                      </button>
                   </div>
                   <div className="p-8">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{product.name}</h3>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 line-clamp-1 italic">{product.description}</p>
                      
                      <div className="flex items-center justify-between">
                         <span className="text-2xl font-black text-black dark:text-white italic">₹{product.price} <span className="text-[10px] uppercase tracking-normal not-italic text-slate-400">/pc</span></span>
                         <Link 
                            href={`/product/${product.slug}`}
                            className="bg-black text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-2 hover:bg-secondary transition-colors"
                         >
                            Add To Cart <ShoppingBag size={14} />
                         </Link>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
