"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Package, Search, Calendar, ChevronDown, CheckCircle, Clock, RefreshCw, Truck, X, Save } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    trackingNumber: "",
    courierName: "",
    trackingUrl: ""
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/orders");
      setOrders(res.data || res.orders || res);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (order: any) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.orderStatus || order.status,
      trackingNumber: order.deliveryTracking?.trackingNumber || "",
      courierName: order.deliveryTracking?.courierName || "",
      trackingUrl: order.deliveryTracking?.trackingUrl || ""
    });
    setIsModalOpen(true);
  };

  const handleUpdateOrder = async () => {
    try {
      await fetchApi(`/orders/${selectedOrder._id}/status`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      setIsModalOpen(false);
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      loadOrders(); 
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const filteredOrders = Array.isArray(orders) 
    ? orders.filter(o => o._id.includes(searchTerm) || (o.user && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()))) 
    : [];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered': return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
      case 'Processing': return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
      case 'Shipped': return "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20";
      case 'Cancelled': return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
      default: return "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Delivered': return "bg-emerald-500";
      case 'Processing': return "bg-blue-500";
      case 'Shipped': return "bg-indigo-500";
      case 'Cancelled': return "bg-rose-500";
      default: return "bg-orange-500";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Order Management</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Track and manage customer orders in real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
              </div>
              <div className="w-px h-4 bg-slate-100 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivered</span>
              </div>
           </div>
           <button onClick={loadOrders} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-90">
             <RefreshCw size={18} className={`text-slate-400 ${loading ? "animate-spin text-indigo-500" : ""}`} />
           </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full max-w-lg group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID or Customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-950/50 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
          
          <div className="px-6 py-3.5 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
             <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Total Orders: {filteredOrders.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto px-6 py-4">
          {loading && orders.length === 0 ? (
            <div className="p-24 text-center">
              <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Loading orders...</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500">
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Order ID / Date</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Customer Details</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Payment</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-right">Order Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? currentOrders.map((order: any) => (
                  <tr key={order._id} className="bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800 transition-all group hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                    <td className="px-6 py-5 first:rounded-l-[1.5rem]">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                           <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                             <Package size={14} strokeWidth={2.5} />
                           </div>
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2 ml-10">
                           <Calendar size={10} className="text-slate-300 dark:text-slate-600" />
                           <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                            {new Date(order.createdAt).toLocaleDateString()} — {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-white dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                          {(order.user?.name || "G")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 dark:text-white">{order.user?.name || "Anonymous User"}</span>
                           <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 tracking-tight">{order.user?.email || "No contact found"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-black text-slate-900 dark:text-white tracking-tighter">₹{order.totalAmount?.toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 shadow-sm w-fit uppercase tracking-tighter">{order.paymentMethod || "CREDIT"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 last:rounded-r-[1.5rem] text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openUpdateModal(order)}
                          className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:text-indigo-600 transition-all active:scale-95"
                        >
                          <Truck size={16} />
                        </button>

                        <div className="relative inline-block text-left group/dropdown">
                          <div className={`inline-flex min-w-[150px] justify-between items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm group-hover/dropdown:shadow-md active:scale-95 ${getStatusBadge(order.orderStatus || order.status)}`}>
                            <div className="flex items-center gap-2.5">
                              <span className={`h-2 w-2 rounded-full ${getStatusDot(order.orderStatus || order.status)} animate-pulse shadow-[0_0_8px_currentColor] transition-all`}></span>
                              {order.orderStatus || order.status}
                            </div>
                            <ChevronDown size={14} className="opacity-40 group-hover/dropdown:translate-y-0.5 transition-transform" />
                          </div>
                          
                          <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-slate-100 dark:ring-slate-700 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible translate-y-2 group-hover/dropdown:translate-y-0 transition-all duration-300 z-50 p-2">
                            <div className="flex flex-col gap-1.5">
                              <p className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-slate-700/50 mb-1">Update Status</p>
                              {[
                                { s: "Processing", c: "bg-blue-500" },
                                { s: "Shipped", c: "bg-indigo-500" },
                                { s: "Delivered", c: "bg-emerald-500" },
                                { s: "Cancelled", c: "bg-rose-500" }
                              ].map(({ s, c }) => (
                                <button 
                                  key={s}
                                  onClick={() => handleQuickStatusUpdate(order._id, s)} 
                                  className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 transition-colors group/btn"
                                >
                                  <div className={`h-2 w-2 rounded-full ${c} group-hover/btn:scale-125 transition-transform`}></div>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-24 text-center">
                       <div className="p-10 bg-slate-50 dark:bg-slate-950/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 max-w-sm mx-auto">
                        <Clock size={40} className="text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">No Orders Found</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">Try adjusting your filters or check back later.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Modernized */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 p-8">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Page <span className="text-slate-900 dark:text-white">{currentPage}</span> of <span className="text-slate-900 dark:text-white">{totalPages}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-10 w-10 rounded-xl text-xs font-black transition-all duration-300 ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-8 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                    <Truck size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Dispatch Details</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order #{selectedOrder?._id.substring(selectedOrder?._id.length - 8).toUpperCase()}</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                  <select 
                    value={updateData.status}
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-balance">Courier Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. BlueDart"
                      value={updateData.courierName}
                      onChange={(e) => setUpdateData({...updateData, courierName: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tracking ID</label>
                    <input 
                      type="text"
                      placeholder="AWB0000000"
                      value={updateData.trackingNumber}
                      onChange={(e) => setUpdateData({...updateData, trackingNumber: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold outline-none"
                    />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tracking URL</label>
                  <input 
                    type="url"
                    placeholder="https://tracker.com/..."
                    value={updateData.trackingUrl}
                    onChange={(e) => setUpdateData({...updateData, trackingUrl: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-sm font-bold outline-none"
                  />
               </div>
            </div>

            <div className="p-8 bg-slate-50/50 dark:bg-slate-950/50 flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100"
              >
                Discard
              </button>
              <button 
                onClick={handleUpdateOrder}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
