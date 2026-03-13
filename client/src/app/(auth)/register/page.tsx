'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      
      const pendingItem = sessionStorage.getItem('pending_cart_item');
      if (pendingItem) {
        try {
          const config = JSON.parse(pendingItem);
          await addToCart(config);
          sessionStorage.removeItem('pending_cart_item');
          router.push('/cart');
          return;
        } catch (err) {
          console.error('Pending cart item error:', err);
        }
      }
      
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-44 pb-20 flex items-center justify-center relative bg-slate-50">
        <div className="relative w-full max-w-lg px-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.05)]">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3">
                Join Printex Labels
              </h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Join our community for premium solutions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold px-4 py-3 rounded-2xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-secondary text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-primary/10 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Register Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Already have an account?</p>
              <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                Sign In <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
