'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Package, 
  ShoppingBag, 
  Download, 
  CheckCircle2, 
  Truck, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await fetchApi(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
        // router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, router]);

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'delivered': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'shipped': return <Truck className="w-6 h-6 text-blue-500" />;
      case 'processing': return <Package className="w-6 h-6 text-primary" />;
      case 'cancelled': return <XCircle className="w-6 h-6 text-red-500" />;
      default: return <Clock className="w-6 h-6 text-slate-400" />;
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <h2 className="text-2xl font-bold mb-4">Order not found</h2>
      <Link href="/orders" className="text-secondary font-semibold underline">Back to orders</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/orders" className="flex items-center gap-2 text-slate-500 hover:text-secondary group transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">All Orders</span>
          </Link>
          <button className="flex items-center gap-2 text-primary hover:text-secondary font-bold bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all active:scale-95">
            <Download className="w-4 h-4" /> Download Invoice
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-primary/5 mb-8">
          {/* Order Status Banner */}
          <div className={`px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 ${getStatusStyles(order.orderStatus || order.status)}`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm">
                {getStatusIcon(order.orderStatus || order.status)}
              </div>
              <div>
                <p className="text-sm font-bold opacity-75 uppercase tracking-wider mb-0.5">Order Status</p>
                <h2 className="text-2xl font-black">{order.orderStatus || order.status}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/20 dark:bg-black/10 px-5 py-2.5 rounded-2xl backdrop-blur-sm">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-sm">ETA: 3-5 Business Days</span>
            </div>
          </div>

          <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
               {/* Shipping Info */}
               <div className="space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-primary" /> Shipping Info
                 </h3>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <p className="font-black text-slate-900 dark:text-white mb-2">{order.shippingAddress.name || 'Current User'}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country} • {order.shippingAddress.phone}
                    </p>
                 </div>
               </div>

               {/* Payment Info */}
               <div className="space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <CreditCard className="w-4 h-4 text-primary" /> Payment Info
                 </h3>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <p className="font-black text-slate-900 dark:text-white mb-2">{order.paymentMethod}</p>
                    <div className="flex items-center gap-2 mt-4 text-green-600 font-bold bg-green-100 dark:bg-green-500/10 px-3 py-1.5 rounded-lg w-fit text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" /> Paid via {order.paymentMethod}
                    </div>
                 </div>
               </div>
             </div>

             {/* Items Table */}
             <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <ShoppingBag className="w-4 h-4 text-primary" /> Order Summary
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700/50">
                        <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tighter">Product</th>
                        <th className="text-center px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tighter">Qty</th>
                        <th className="text-right px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tighter">Price</th>
                        <th className="text-right px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-tighter">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {order.items.map((item: any, idx: number) => (
                        <tr key={idx} className="group hover:bg-white dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
                                <img 
                                  src={item.designUrl ? getImageUrl(item.designUrl) : getImageUrl(item.image || item.product?.mainImage)} 
                                  alt="item" 
                                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                                />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 uppercase tracking-tight">{item.name || item.product?.name || 'Product'}</p>
                                <div className="flex flex-col mt-0.5">
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 flex-wrap">
                                    {item.selectedShape && <span>{item.selectedShape}</span>}
                                    {item.selectedShape && <span>•</span>}
                                    <span>{item.selectedSize}</span>
                                    <span>•</span>
                                    <span>{item.selectedMaterial || item.selectedFinish}</span>
                                  </p>
                                  {item.needsDesign && (
                                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter w-fit mt-1">Pro Design</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">× {item.quantity}</td>
                          <td className="px-6 py-4 text-right font-semibold text-slate-500 dark:text-slate-400">₹{(item.price || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right font-black text-secondary italic">₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Totals Section */}
                  <div className="bg-slate-100/50 dark:bg-slate-800/80 px-8 py-8 space-y-3">
                    <div className="flex justify-between text-sm text-slate-500 font-bold">
                      <span>Total Items</span>
                      <span>{order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 font-bold">
                      <span>Shipping Cost</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Grand Total</span>
                      <span className="text-3xl font-black text-secondary italic">₹{(order.totalAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-secondary font-black hover:bg-secondary/10 px-8 py-4 rounded-2xl transition-all"
          >
            Continue Shopping <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
