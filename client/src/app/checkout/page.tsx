'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchApi, getImageUrl } from '@/lib/api';
import { 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Plus, 
  Trash2, 
  ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment/Review
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phoneNumber || '',
    isDefault: false
  });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Razorpay'>('Razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState<any>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      router.push('/cart');
    }
  }, [cart, cartLoading, router]);

  useEffect(() => {
    if (user?.addresses?.length) {
      setSelectedAddress(user.addresses.find((a: any) => a.isDefault) || user.addresses[0]);
      setShowAddressForm(false);
    } else if (user && !user.addresses?.length) {
      setShowAddressForm(true);
    }
  }, [user]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    try {
      const res = await fetchApi('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ 
          code: couponCode, 
          cartTotal: cart?.bill || 0 
        })
      });
      if (res.success) {
        setDiscount(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'Invalid coupon');
      setDiscount(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const finalAmount = (cart?.bill || 0) - (discount?.discountAmount || 0);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi('/auth/address', {
        method: 'POST',
        body: JSON.stringify(newAddress)
      });
      setShowAddressForm(false);
      await updateProfile({});
      setNewAddress({ address: '', city: '', state: '', postalCode: '', country: 'India', phone: user?.phoneNumber || '', isDefault: false });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setLoading(true);
    try {
      const orderData = {
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
        totalAmount: finalAmount,
        couponCode: discount?.code
      };

      const result = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      if (!result.success) {
        throw new Error(result.message || 'Failed to create order');
      }

      const { order, razorpayOrder } = result.data;

      if (paymentMethod === 'Razorpay' && razorpayOrder) {
        const res = await loadRazorpayScript();

        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          setLoading(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Printex Labels",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
              setLoading(true);
              const verifyRes = await fetchApi('/payment/verify', {
                method: 'POST',
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order._id
                })
              });

              if (verifyRes.success) {
                clearCart();
                router.push(`/orders/${order._id}`);
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            } catch (err: any) {
              alert(err.message || 'Verification failed');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: selectedAddress.phone
          },
          theme: {
            color: "#4f46e5"
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        clearCart();
        router.push(`/orders/${order._id}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Something went wrong');
    }
  };

  if (cartLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 pt-44">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-44">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 sticky top-[110px] z-40">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Cart</span>
            </Link>
            <div className="flex items-center gap-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>1</span>
                <span className="font-semibold hidden sm:block">Shipping</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>2</span>
                <span className="font-semibold hidden sm:block">Payment</span>
              </div>
            </div>
            <div className="w-24"></div> 
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              {step === 1 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <MapPin className="text-indigo-600" />
                      Shipping Address
                    </h2>
                    {!showAddressForm && (
                      <button 
                        onClick={() => setShowAddressForm(true)}
                        className="text-indigo-600 hover:text-indigo-500 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Add New
                      </button>
                    )}
                  </div>

                  {showAddressForm ? (
                    <form onSubmit={handleAddAddress} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Street Address</label>
                          <input 
                            required
                            value={newAddress.address}
                            onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Phone Number</label>
                          <input 
                            required
                            value={newAddress.phone}
                            onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium">City</label>
                          <input 
                            required
                            value={newAddress.city}
                            onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium">State</label>
                          <input 
                            required
                            value={newAddress.state}
                            onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Zip Code</label>
                          <input 
                            required
                            value={newAddress.postalCode}
                            onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" 
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Save Address</button>
                        <button type="button" onClick={() => setShowAddressForm(false)} className="bg-slate-100 dark:bg-slate-800 px-8 py-3 rounded-xl font-bold text-slate-600">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user?.addresses?.map((addr: any) => (
                        <div 
                          key={addr._id}
                          onClick={() => setSelectedAddress(addr)}
                          className={`cursor-pointer relative p-6 bg-white dark:bg-slate-900 border-2 rounded-3xl transition-all ${selectedAddress?._id === addr._id ? 'border-indigo-600 ring-4 ring-indigo-500/10' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'}`}
                        >
                          {selectedAddress?._id === addr._id && (
                            <div className="absolute top-4 right-4 text-indigo-600">
                              <CheckCircle2 className="w-6 h-6 fill-indigo-600 text-white" />
                            </div>
                          )}
                          <p className="font-bold text-slate-900 dark:text-white mb-2">{user.name}</p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {addr.address}<br />
                            {addr.city}, {addr.state} - {addr.postalCode}<br />
                            {addr.country} • {addr.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-8">
                    <button 
                      disabled={!selectedAddress}
                      onClick={() => setStep(2)}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold py-4 px-12 rounded-2xl shadow-xl shadow-indigo-500/25 transition-all"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <CreditCard className="text-indigo-600" />
                      Payment Method
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setPaymentMethod('Razorpay')}
                        className={`p-6 bg-white dark:bg-slate-900 border-2 rounded-3xl flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-indigo-600 ring-4 ring-indigo-500/10' : 'border-slate-100 hover:border-indigo-200'}`}
                      >
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center">
                          <CreditCard className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-bold">Online Payment</p>
                          <p className="text-sm text-slate-500">Razorpay / Card / UPI</p>
                        </div>
                        {paymentMethod === 'Razorpay' && (
                          <div className="ml-auto">
                             <CheckCircle2 className="w-6 h-6 fill-indigo-600 text-white" />
                          </div>
                        )}
                      </div>

                      <div 
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-6 bg-white dark:bg-slate-900 border-2 rounded-3xl flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-indigo-600 ring-4 ring-indigo-500/10' : 'border-slate-100 hover:border-indigo-200'}`}
                      >
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center">
                          <ShoppingBag className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-bold">Cash on Delivery</p>
                          <p className="text-sm text-slate-500">Pay when your labels arrive</p>
                        </div>
                        {paymentMethod === 'COD' && (
                          <div className="ml-auto">
                             <CheckCircle2 className="w-6 h-6 fill-indigo-600 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Review Items</h3>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                      {cart?.items.map((item) => (
                        <div key={item._id} className="p-4 flex gap-4 items-center">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative border border-slate-100 dark:border-slate-800">
                            <Image 
                              src={item.designUrl ? getImageUrl(item.designUrl) : getImageUrl(item.product?.mainImage)} 
                              alt={item.product?.name} 
                              fill 
                              className="object-contain" 
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm uppercase tracking-tight">{item.product?.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              {item.selectedSize} • {item.selectedFinish}
                            </p>
                            {item.needsDesign && (
                              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Pro Design Needed</span>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 dark:text-white italic">₹{item.itemTotal.toLocaleString()}</p>
                            <p className="text-[10px] font-medium text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="bg-slate-100 dark:bg-slate-800 px-8 py-4 rounded-2xl font-bold text-slate-600 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Place Order <ShoppingBag className="w-5 h-5" /></>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative mb-6">
                <h3 className="text-xl font-bold mb-4">Apply Coupon</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="CODE10"
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode}
                    className="bg-black text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {discount && (
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-3 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {discount.code} Applied: ₹{discount.discountAmount} Off
                  </p>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <h3 className="text-xl font-bold mb-6">Price Details</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Price ({cart?.totalItems} items)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{(cart?.bill || 0).toLocaleString()}</span>
                  </div>
                  {discount && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{discount.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes (GST 18%)</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-[10px] uppercase tracking-widest">Included</span>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>
                  <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white italic">
                    <span>Grand Total</span>
                    <span className="text-indigo-600 underline underline-offset-4 decoration-indigo-200 decoration-2">₹{finalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      You're saving <span className="text-indigo-600 font-bold">$40.00</span> on this order with free express shipping.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    100% Authentic Products
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Safe & Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

