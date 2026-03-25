'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// 1. Extract the logic into a sub-component
function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  
  // useSearchParams must be inside the Suspense boundary
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirect || '/');
    }
  }, [user, authLoading, router, redirect]);

  if (authLoading || user) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      
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
      
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3">
          Welcome Back
        </h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 text-xs font-bold px-4 py-3 rounded-2xl animate-in shake duration-500">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          icon={<Mail />}
          required
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
            <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-black transition-colors">
              Forgot?
            </Link>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<Lock />}
            required
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="w-full"
          size="lg"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">New here?</p>
        <Link href="/register" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-black transition-colors">
          Create Account <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// 2. Main Page component with Suspense wrapper
export default function LoginPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-44 pb-20 flex items-center justify-center relative bg-slate-50">
        <div className="relative w-full max-w-md px-6">
          <Suspense fallback={
            <div className="flex justify-center items-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          }>
            <LoginContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}