'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Plus, Trash2, Home, Briefcase, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AddressesPage() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phoneNumber || '',
    isDefault: false
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi('/auth/address', {
        method: 'POST',
        body: JSON.stringify(newAddress)
      });
      // Trigger user profile refresh
      await updateProfile({});
      setShowForm(false);
      setNewAddress({ address: '', city: '', state: '', postalCode: '', country: 'India', phone: user?.phoneNumber || '', isDefault: false });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      await fetchApi(`/auth/address/${id}`, { method: 'DELETE' });
      await updateProfile({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-44 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Saved Addresses</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Manage your delivery locations for faster checkout</p>
            </div>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-secondary hover:brightness-110 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-2xl shadow-secondary/20"
              >
                <Plus size={14} /> Add New Address
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleAddAddress} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-3xl mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Add Delivery Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Street Address</label>
                  <input 
                    required
                    value={newAddress.address}
                    onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/30 font-bold placeholder:text-slate-300" 
                    placeholder="Apartment, Street, Area"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mobile Number</label>
                  <input 
                    required
                    value={newAddress.phone}
                    onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/30 font-bold placeholder:text-slate-300"
                    placeholder="10-digit mobile"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City</label>
                  <input 
                    required
                    value={newAddress.city}
                    onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/30 font-bold placeholder:text-slate-300"
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">State</label>
                  <input 
                    required
                    value={newAddress.state}
                    onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/30 font-bold placeholder:text-slate-300"
                    placeholder="Enter state"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Zip Code</label>
                  <input 
                    required
                    value={newAddress.postalCode}
                    onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/30 font-bold placeholder:text-slate-300"
                    placeholder="6-digit code"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-10">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-secondary hover:brightness-110 text-white font-black uppercase tracking-widest text-[10px] px-12 py-5 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-secondary/20"
                >
                  {loading ? 'Adding...' : 'Save this Address'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="bg-slate-100 dark:bg-slate-800 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 transition-all hover:bg-slate-200"
                >
                  Discard
                </button>
              </div>
            </form>
          )}

          {authLoading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : !user?.addresses?.length && !showForm ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="text-slate-300" size={32} />
               </div>
               <p className="font-black text-slate-400 uppercase tracking-widest text-sm">You haven't added any addresses yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user?.addresses?.map((addr: any) => (
                <div 
                  key={addr._id}
                  className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      {addr.isDefault ? <CheckCircle2 size={24} /> : <Home size={24} />}
                    </div>
                    <button 
                      onClick={() => handleRemoveAddress(addr._id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-1 mb-6">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deliver to</p>
                     <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter italic">{user.name}</h3>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 font-bold text-sm leading-loose">
                    {addr.address}<br />
                    <span className="text-slate-900 dark:text-white">{addr.city}, {addr.state}</span><br />
                    {addr.postalCode} • {addr.country}<br />
                    <span className="text-xs text-slate-400 font-black tracking-widest">{addr.phone}</span>
                  </p>

                  {addr.isDefault && (
                    <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 rounded-full">Default Selection</span>
                    </div>
                  )}
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

