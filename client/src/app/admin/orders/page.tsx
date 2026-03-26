"use client";

import { useEffect, useState } from "react";
import { fetchApi, getImageUrl } from "@/lib/api";
import { Package, Search, Calendar, ChevronDown, CheckCircle, Clock, RefreshCw, Truck, X, Save, Eye, MapPin, Phone, User as UserIcon, MoreVertical, ExternalLink, Download } from "lucide-react";
import { useAlertModal } from "@/contexts/ModalContext";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { showAlert } = useAlertModal();

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
      const data = res.data || res.orders || res;
      setOrders(Array.isArray(data) ? data : []);
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
    } catch (err: any) {
      console.error(err);
      showAlert("Update Error", err.message || "Failed to update order", "error");
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      loadOrders(); 
    } catch (err: any) {
      console.error(err);
      showAlert("Update Error", err.message || "Failed to update status", "error");
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
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(37,68,65,0.3)]" />
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Order Management</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-5">Comprehensive tracking and fulfillment control center.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex items-center gap-6 bg-white dark:bg-slate-900 px-8 py-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active</span>
                <div className="h-2 w-10 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
              </div>
              <div className="w-px h-6 bg-slate-100 dark:bg-slate-800" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivered</span>
                <div className="h-2 w-10 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              </div>
           </div>
           <button 
             onClick={loadOrders} 
             className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-90 group"
             title="Refresh Data"
           >
             <RefreshCw size={22} className={`text-slate-400 group-hover:text-primary transition-colors ${loading ? "animate-spin text-primary" : ""}`} />
           </button>
        </div>
      </div>

      {/* Main Table View Wrapper */}
      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-premium border border-slate-100 dark:border-slate-800 overflow-visible">
        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full max-w-xl group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-16 pr-8 py-5 border border-slate-100 dark:border-slate-800 rounded-[2rem] bg-slate-50 dark:bg-slate-950/50 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-[6px] focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-inner"
            />
          </div>
          
          <div className="px-8 py-4 bg-primary/5 dark:bg-primary/10 rounded-[1.5rem] border border-primary/10">
             <span className="text-[11px] font-black text-primary dark:text-primary-foreground uppercase tracking-[0.2em]">Total Orders: {filteredOrders.length}</span>
          </div>
        </div>

        {/* Scrollable area with min-height to prevent dropdown clipping */}
        <div className="overflow-x-auto px-6 pb-20 min-h-[450px]">
          {loading && orders.length === 0 ? (
            <div className="py-32 text-center">
              <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-8"></div>
              <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500">
                  <th className="px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em]">Order Logistics</th>
                  <th className="px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em]">Customer Profile</th>
                  <th className="px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em]">Financials</th>
                  <th className="px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-right pr-12">Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? currentOrders.map((order: any) => (
                  <tr 
                    key={order._id} 
                    className="relative bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition-all group/row hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 z-10 hover:z-30"
                  >
                    <td className="px-6 py-6 first:rounded-l-[2rem]">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                           <div className="p-3 bg-white dark:bg-slate-800 text-primary dark:text-primary-foreground rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover/row:scale-110 transition-transform">
                             <Package size={18} strokeWidth={2.5} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                              #{order._id.substring(order._id.length - 8).toUpperCase()}
                             </span>
                             <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Premium Order</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 ml-14">
                           <Calendar size={12} className="text-slate-300 dark:text-slate-600" />
                           <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-[1.25rem] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border-2 border-white dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-xl shadow-sm group-hover/row:rotate-6 transition-transform overflow-hidden relative">
                          <div className="absolute inset-0 bg-primary/5 dark:bg-primary/20" />
                          <span className="relative">{(order.user?.name || "G")[0].toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-base font-black text-slate-900 dark:text-white">{order.user?.name || "Anonymous User"}</span>
                           <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold tracking-tight">
                             <UserIcon size={10} className="text-primary/40"/>
                             <span className="truncate max-w-[150px]">{order.user?.email || "No contact info"}</span>
                           </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">₹{order.totalAmount?.toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm w-fit uppercase tracking-tighter">
                            {order.paymentInfo?.method || order.paymentMethod || "COD"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 last:rounded-r-[2rem] text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button 
                          onClick={() => openUpdateModal(order)}
                          className="flex items-center gap-2 px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm group-hover/row:border-primary/30 group-hover/row:text-primary transition-all active:scale-95 text-[11px] font-black uppercase tracking-widest"
                        >
                          <Eye size={16} />
                          Details
                        </button>

                        <div className="relative inline-block text-left group/dropdown">
                          <div className={`inline-flex min-w-[160px] justify-between items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm group-hover/dropdown:shadow-xl active:scale-95 cursor-pointer ${getStatusBadge(order.orderStatus || order.status)}`}>
                            <div className="flex items-center gap-3">
                              <span className={`h-2.5 w-2.5 rounded-full ${getStatusDot(order.orderStatus || order.status)} animate-pulse shadow-[0_0_10px_currentColor]`}></span>
                              {order.orderStatus || order.status}
                            </div>
                            <ChevronDown size={14} className="opacity-40 group-hover/dropdown:rotate-180 transition-transform duration-500" />
                          </div>
                          
                          {/* Dropdown Menu with absolute positioning and calibrated z-index */}
                          <div className="absolute right-0 mt-4 w-60 origin-top-right rounded-[2rem] bg-white dark:bg-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible translate-y-4 group-hover/dropdown:translate-y-0 transition-all duration-300 z-[35] p-3 overflow-hidden">
                            <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-[1.5rem] p-4 mb-2 flex flex-col gap-1 border border-slate-100 dark:border-slate-700/50">
                              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Current State</p>
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${getStatusDot(order.orderStatus || order.status)}`} />
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{order.orderStatus || order.status}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {[
                                { s: "Processing", c: "bg-blue-500", desc: "Order is being prepared" },
                                { s: "Shipped", c: "bg-indigo-500", desc: "Out for delivery" },
                                { s: "Delivered", c: "bg-emerald-500", desc: "Customer received items" },
                                { s: "Cancelled", c: "bg-rose-500", desc: "Order voided" }
                              ].map(({ s, c, desc }) => (
                                <button 
                                  key={s}
                                  onClick={() => handleQuickStatusUpdate(order._id, s)} 
                                  className="w-full text-left p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all group/btn flex flex-col gap-0.5"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`h-2.5 w-2.5 rounded-full ${c} group-hover/btn:scale-125 transition-transform shadow-[0_0_5px_currentColor]`}></div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 group-hover/btn:text-primary transition-colors">{s}</span>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 ml-5.5">{desc}</span>
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
                    <td colSpan={4} className="px-6 py-32 text-center">
                       <div className="p-16 bg-slate-50 dark:bg-slate-950/50 rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800 max-w-md mx-auto relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Clock size={60} className="text-slate-200 dark:text-slate-800 mx-auto mb-8 animate-pulse" />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">No Records Found</h3>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-3 max-w-xs mx-auto leading-relaxed">It seems we don't have any orders matching your criteria yet. Keep waiting for that next sale!</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Revitalized */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 p-10 bg-slate-50/30 dark:bg-slate-900/30">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Showing <span className="text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="text-slate-900 dark:text-white">{filteredOrders.length}</span> results
                </p>
              </div>
              <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-11 px-6 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary disabled:opacity-20 flex items-center gap-2"
                >
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-xs font-black transition-all duration-500 ${currentPage === i + 1 ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-11 px-6 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary disabled:opacity-20 flex items-center gap-2"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Order Modal (Details + Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-10 border-b border-slate-50 dark:border-slate-800 relative overflow-hidden">
              {/* Header Gradient Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-6 relative z-10">
                 <div className="p-4 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-primary/20">
                    <Truck size={32} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Order Intelligence</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">System Reference: #{selectedOrder?._id.substring(selectedOrder?._id.length - 8).toUpperCase()}</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all relative z-10 group">
                <X size={24} className="text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
               {/* Order Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                       <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <MapPin size={14} className="text-primary"/> Shipping Foundation
                       </h3>
                       <div className="space-y-2">
                         <p className="text-base font-black text-slate-900 dark:text-white leading-snug">{selectedOrder?.shippingAddress?.address}</p>
                         <p className="text-sm font-bold text-slate-500 dark:text-slate-400 truncate">{selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state || ""} - {selectedOrder?.shippingAddress?.postalCode}</p>
                         <div className="flex items-center gap-2 mt-4 text-xs font-black text-primary">
                            <Phone size={12}/> {selectedOrder?.shippingAddress?.phone || "No phone linked"}
                         </div>
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                       <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Package size={14} className="text-primary"/> Package Payload
                       </h3>
                       <div className="space-y-4">
                          {selectedOrder?.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                               {item.image ? (
                                 <img src={getImageUrl(item.image)} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                               ) : (
                                 <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                   <Package size={20} className="text-slate-300" />
                                 </div>
                               )}
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-2">
                                     <p className="text-xs font-black text-slate-900 dark:text-white truncate">{item.name}</p>
                                     {item.designUrl ? (
                                        <a 
                                          href={getImageUrl(item.designUrl)} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                                          download
                                        >
                                          <Download size={10} /> Download
                                        </a>
                                     ) : item.needsDesign && (
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20">
                                          <Clock size={10} /> Needs Design
                                        </span>
                                     )}
                                  </div>
                                  <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                                     {item.selectedShape && <span className="text-[9px] font-black uppercase text-slate-400 border border-slate-100 dark:border-slate-800 px-1.5 py-0.5 rounded">{item.selectedShape}</span>}
                                     {item.selectedSize && <span className="text-[9px] font-black uppercase text-slate-400 border border-slate-100 dark:border-slate-800 px-1.5 py-0.5 rounded">{item.selectedSize}</span>}
                                     {item.selectedMaterial && <span className="text-[9px] font-black uppercase text-secondary border border-secondary/10 bg-secondary/5 px-1.5 py-0.5 rounded">{item.selectedMaterial}</span>}
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                               </div>
                               <div className="text-sm font-black text-primary dark:text-white">
                                 ₹{(item.quantity * item.price).toLocaleString()}
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">₹{selectedOrder?.totalAmount?.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 bg-slate-100/50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-primary/10 space-y-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fulfillment Status</label>
                          <div className="relative group/sel">
                            <select 
                              value={updateData.status}
                              onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-sm font-black outline-none focus:ring-[6px] focus:ring-primary/5 focus:border-primary appearance-none transition-all shadow-sm"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logistics Provider</label>
                            <input 
                              type="text"
                              placeholder="e.g. DHL Express"
                              value={updateData.courierName}
                              onChange={(e) => setUpdateData({...updateData, courierName: e.target.value})}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Waybill Number</label>
                            <input 
                              type="text"
                              placeholder="ID000000000"
                              value={updateData.trackingNumber}
                              onChange={(e) => setUpdateData({...updateData, trackingNumber: e.target.value})}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                            />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                             System Tracking Link <ExternalLink size={10} className="text-slate-300"/>
                          </label>
                          <input 
                            type="url"
                            placeholder="https://track-your-shipment.com/..."
                            value={updateData.trackingUrl}
                            onChange={(e) => setUpdateData({...updateData, trackingUrl: e.target.value})}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                          />
                       </div>
                    </div>

                    <div className="flex flex-col gap-3 p-1">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-8">Changing status sends an automatic notification to the customer email</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-10 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 active:scale-95"
              >
                Exit Session
              </button>
              <button 
                onClick={handleUpdateOrder}
                className="flex-[2] bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
              >
                <Save size={18} className="group-hover:scale-110 transition-transform"/> Deploy Fulfillment Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
