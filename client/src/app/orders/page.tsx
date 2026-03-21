'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Package, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Truck, 
  Clock, 
  XCircle, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await fetchApi('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing': return <Package className="w-5 h-5 text-primary" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'delivered': return 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400';
      case 'shipped': return 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'processing': return 'bg-primary/10 text-primary';
      case 'cancelled': return 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <>
      <Header />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 pt-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-44 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Order History</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage and track your recent orders with Printix</p>
              </div>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold px-6 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                Start New Order <ShoppingBag className="w-4 h-4" />
              </Link>
            </div>

            {!orders || orders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xl shadow-primary/5">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">No orders found</h2>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">You haven't placed any orders yet. Once you do, they will appear here!</p>
                <Link 
                  href="/" 
                  className="bg-secondary text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-secondary/25 hover:scale-105 active:scale-95 transition-all inline-block"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div 
                    key={order._id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex gap-x-8 gap-y-4 flex-wrap">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Placed On</p>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Bill</p>
                          <p className="text-sm font-bold text-secondary italic">₹{(order.totalAmount || 0).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${getStatusStyles(order.orderStatus || order.status)}`}>
                        {getStatusIcon(order.orderStatus || order.status)}
                        {order.orderStatus || order.status}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none w-full max-w-[60%]">
                          {order.items.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="relative w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center p-1">
                              <img 
                                src={item.designUrl ? getImageUrl(item.designUrl) : getImageUrl(item.image || item.product?.mainImage)} 
                                alt="item" 
                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px] text-white font-bold text-center">×{item.quantity}</div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 shrink-0">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                          <Link 
                            href={`/orders/${order._id}`}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-secondary hover:brightness-110 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-secondary/25 transition-all active:scale-95 text-sm"
                          >
                            View Details <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
