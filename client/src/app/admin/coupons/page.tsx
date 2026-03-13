"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Plus, Trash2, Tag, Search, X, Edit, Calendar, Percent, Banknote } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState<number | "">("");
  const [minPurchase, setMinPurchase] = useState<number | "">("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [usageLimit, setUsageLimit] = useState<number | "">("");

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/coupons");
      setCoupons(res.data || []);
    } catch (err) {
      console.error("Failed to load coupons", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minPurchase: minPurchase || 0,
        expiresAt,
        isActive,
        usageLimit: usageLimit || null
      };
      
      if (editingId) {
        await fetchApi(`/coupons/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await fetchApi("/coupons", { method: "POST", body: JSON.stringify(payload) });
      }
      handleCancelForm();
      loadCoupons();
    } catch (err: any) {
      alert(err.message || "Failed to save coupon");
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setCode("");
    setDiscountType("percentage");
    setDiscountValue("");
    setMinPurchase("");
    setExpiresAt("");
    setIsActive(true);
    setUsageLimit("");
  };

  const handleEditClick = (coupon: any) => {
    setEditingId(coupon._id);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinPurchase(coupon.minPurchase);
    setExpiresAt(new Date(coupon.expiresAt).toISOString().split('T')[0]);
    setIsActive(coupon.isActive);
    setUsageLimit(coupon.usageLimit || "");
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;
    try {
      await fetchApi(`/coupons/${id}`, { method: "DELETE" });
      loadCoupons();
    } catch (err: any) {
      alert(err.message || "Failed to delete coupon");
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Coupons</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Manage discount codes and promotions.</p>
        </div>
        <button
          onClick={() => {
             if (showAddForm) handleCancelForm();
             else setShowAddForm(true);
          }}
          className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${
            showAddForm 
              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
          }`}
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? "Cancel" : "Add Coupon"}
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-indigo-600 dark:bg-indigo-500 p-3 rounded-[1.25rem] shadow-lg shadow-indigo-600/20">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {editingId ? "Edit Coupon" : "New Coupon"}
              </h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Coupon Details</p>
            </div>
          </div>

          <form onSubmit={handleSaveCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Coupon Code</label>
              <input 
                required 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" 
                placeholder="SAVE50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Discount Type</label>
              <select 
                value={discountType} 
                onChange={(e) => setDiscountType(e.target.value)} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold appearance-none cursor-pointer"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Discount Value</label>
              <input 
                required 
                type="number" 
                value={discountValue} 
                onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" 
                placeholder={discountType === 'percentage' ? "10" : "500"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Minimum Purchase (₹)</label>
              <input 
                type="number" 
                value={minPurchase} 
                onChange={(e) => setMinPurchase(e.target.value === '' ? '' : Number(e.target.value))} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" 
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Expires At</label>
              <input 
                required 
                type="date" 
                value={expiresAt} 
                onChange={(e) => setExpiresAt(e.target.value)} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Usage Limit</label>
              <input 
                type="number" 
                value={usageLimit} 
                onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" 
                placeholder="100"
              />
            </div>
            
            <div className="flex items-center pt-2">
              <label className="group flex items-center cursor-pointer select-none">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-emerald-500 transition-all duration-300" />
                  <div className="content-[''] absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6 shadow-sm" />
                </div>
                <span className="ml-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Coupon Active</span>
              </label>
            </div>
            
            <div className="lg:col-span-3 flex justify-end gap-4 mt-4 border-t border-slate-100 dark:border-slate-800 pt-10">
              <button 
                type="button" 
                onClick={handleCancelForm} 
                className="px-8 py-4 text-xs font-black text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all uppercase tracking-widest border border-slate-100 dark:border-slate-800"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-10 py-4 text-xs font-black text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all uppercase tracking-widest active:scale-95"
              >
                {editingId ? "Save Changes" : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Active Coupons: {coupons.filter(c => c.isActive).length}
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Code</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Discount</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Validity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Usage</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 font-sans">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6"><div className="h-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                          <Tag size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{coupon.code}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${coupon.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {coupon.isActive ? 'Live' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white tracking-tight">
                          {coupon.discountType === 'percentage' ? <Percent size={14} className="text-slate-400" /> : <Banknote size={14} className="text-slate-400" />}
                          {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' OFF'}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Min. ₹{coupon.minPurchase}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 w-fit">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center w-32">
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Redeemed</span>
                          <span className="text-[10px] font-black text-slate-900 dark:text-white">{coupon.usedCount} / {coupon.usageLimit || '∞'}</span>
                        </div>
                        <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div 
                            className="h-full bg-indigo-600 rounded-full" 
                            style={{ width: coupon.usageLimit ? `${(coupon.usedCount / coupon.usageLimit) * 100}%` : '10%' }}
                           />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleEditClick(coupon)}
                          className="p-2.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-all shadow-sm"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon._id, coupon.code)}
                          className="p-2.5 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 transition-all shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No coupons available.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
