'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, verifyOTP, user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!formData.phoneNumber.match(/^[0-9\+\-\s]{10,15}$/)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await verifyOTP(formData.email, otp);
      
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
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-44 pb-20 flex items-center justify-center relative bg-slate-50 dark:bg-slate-950 px-6">
        <div className="relative w-full max-w-lg">
          {authLoading || user ? (
            <div className="flex justify-center items-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
          ) : isOtpSent ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3 leading-tight">
                  Verify Email & WhatsApp
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Enter the 6-digit code sent to your email and WhatsApp number</p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 text-xs font-bold px-4 py-3 rounded-2xl animate-in shake duration-500">
                    {error}
                  </div>
                )}

                <Input
                  label="OTP Code"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  icon={<Lock />}
                  maxLength={6}
                  required
                  className="tracking-[0.5em] text-center"
                />

                <Button
                  type="submit"
                  loading={loading}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full"
                  size="lg"
                >
                  Verify & Create Account
                </Button>
              </form>
              <div className="mt-10 text-center">
                <button 
                  onClick={() => setIsOtpSent(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  Edit details / Resend OTP
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3">
                  Join Printix
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Join our community for premium solutions</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 text-xs font-bold px-4 py-3 rounded-2xl animate-in shake duration-500">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    icon={<User />}
                    required
                  />
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    icon={<Phone />}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  icon={<Mail />}
                  required
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<Lock />}
                  required
                  minLength={8}
                />

                <Button
                  type="submit"
                  loading={loading}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full mt-4"
                  size="lg"
                >
                  Register Account
                </Button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Already have an account?</p>
                <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-black transition-colors">
                  Sign In <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
