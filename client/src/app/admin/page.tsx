"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Package, ShoppingBag, Users, AlertTriangle, TrendingUp, IndianRupee, ArrowUpRight, Plus, Box, ShieldCheck, Mail, Calendar } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('this_week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Sample data for chart
  const revenueData = [
    { name: 'Mon', active: 4000, revenue: 2400 },
    { name: 'Tue', active: 3000, revenue: 1398 },
    { name: 'Wed', active: 2000, revenue: 9800 },
    { name: 'Thu', active: 2780, revenue: 3908 },
    { name: 'Fri', active: 1890, revenue: 4800 },
    { name: 'Sat', active: 2390, revenue: 3800 },
    { name: 'Sun', active: 3490, revenue: 4300 },
  ];

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setErrorStatus(null);
        let url = `/admin/stats?range=${dateRange}`;
        if (dateRange === 'custom') {
            if (!customStart || !customEnd) {
                setLoading(false);
                return;
            }
            url += `&start=${customStart}&end=${customEnd}`;
        }
        
        const statsRes = await fetchApi(url);
        if (mounted) {
          setStats(statsRes.data || statsRes); 
        }
      } catch (err: any) {
        if (mounted) {
          console.error("Failed to load dashboard data", err);
          setErrorStatus(err.status || 500);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (dateRange !== 'custom' || (dateRange === 'custom' && customStart && customEnd)) {
        loadData();
    } else if (dateRange === 'custom' && (!customStart || !customEnd) && !stats) {
        setLoading(false); // don't show infinite spinner waiting for custom dates
    }

    return () => {
      mounted = false;
    };
  }, [dateRange, customStart, customEnd]);

  if (loading && !stats) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[1,2,3,4].map((i) => (
        <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      ))}
      <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
    </div>
  );
  
  if (!stats) return (
    <div className="p-8 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-200 dark:border-rose-800 shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <AlertTriangle /> 
        <div>
          <h3 className="font-bold">Failed to load dashboard statistics</h3>
          <p className="text-sm opacity-80">
            {errorStatus === 429 ? 'Too many requests. Please wait a moment and refresh.' : 
             errorStatus === 401 ? 'Session expired or unauthorized. Please log in again.' :
             'Check your server connection or refresh the page.'}
          </p>
        </div>
      </div>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-rose-100 dark:bg-rose-800 hover:bg-rose-200 dark:hover:bg-rose-700 rounded-lg text-sm font-semibold transition-colors">
        Retry
      </button>
    </div>
  );

  const statCards = [
    { 
      label: "Total Revenue", 
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, 
      icon: IndianRupee, 
      color: "from-[#10b981] to-[#059669]", 
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
      trend: "+12.5%",
      subtext: "vs last period"
    },
    { 
      label: "Total Orders", 
      value: stats.totalOrders || 0, 
      icon: ShoppingBag, 
      color: "from-[#3b82f6] to-[#2563eb]", 
      glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
      trend: "+8.2%",
      subtext: "new orders today"
    },
    { 
      label: "Active Products", 
      value: stats.totalProducts || 0, 
      icon: Package, 
      color: "from-[#f59e0b] to-[#d97706]", 
      glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
      trend: "Stable",
      subtext: "inventory items"
    },
    { 
      label: "Registered Users", 
      value: stats.totalUsers || 0, 
      icon: Users, 
      color: "from-[#8b5cf6] to-[#7c3aed]", 
      glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]",
      trend: "+4.1%",
      subtext: "active customers"
    },
  ];

  return (
    <div className={`space-y-10 transition-all duration-700 ${loading ? 'opacity-60 blur-sm pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-secondary rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Real-time store performance and business metrics.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Custom Date Inputs */}
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in zoom-in-95 duration-300">
              <input 
                type="date" 
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-transparent text-xs font-bold rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 outline-none transition-all cursor-pointer"
              />
              <span className="text-slate-400 font-bold">→</span>
              <input 
                type="date" 
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-transparent text-xs font-bold rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 outline-none transition-all cursor-pointer"
              />
            </div>
          )}

          {/* Date Picker Pills */}
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-inner overflow-x-auto no-scrollbar">
            {[
              { id: 'this_week', label: '7D' },
              { id: 'last_week', label: '14D' },
              { id: 'this_month', label: '30D' },
              { id: 'last_month', label: 'Last Mo' },
              { id: 'all_time', label: 'All' },
              { id: 'custom', label: 'Custom' }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => setDateRange(preset.id)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  dateRange === preset.id 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] ring-1 ring-slate-200 dark:ring-slate-700 flex-1' 
                    : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                {preset.id === 'custom' && dateRange === 'custom' && <Calendar size={12} className="text-indigo-500" />}
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 transition-all duration-500 active:scale-95 ${card.glow}`}>
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.05] transform translate-x-4 -translate-y-4 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700">
                <Icon size={120} />
              </div>
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="flex items-start justify-between">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${
                    card.trend.startsWith('+') 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                  }`}>
                    {card.trend}
                  </span>
                </div>
                
                <div className="mt-8">
                  <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{card.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{card.value}</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 italic">{card.subtext}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Revenue Analytics Placeholder with Modern Twist */}
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 p-10 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 dark:from-indigo-500/5 to-transparent pointer-events-none" />
           
           <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={22} className="text-indigo-600 dark:text-indigo-500"/> Revenue Overview
                </h2>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide">Sales performance and transaction trends</p>
              </div>
              <button className="px-5 py-2.5 bg-secondary text-white text-xs font-black rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-secondary/10">
                Download Report
              </button>
           </div>

           <div className="h-80 w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 group relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="text-center group-hover:scale-105 transition-transform duration-500">
                <div className="bg-white dark:bg-slate-900 shadow-xl w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-slate-100 dark:border-slate-800">
                  <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />
                </div>
                <p className="text-lg font-black text-slate-800 dark:text-white">Loading Sales Data...</p>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2 max-w-[200px] mx-auto opacity-70">Fetching the latest analytics from the server</p>
              </div>
           </div>
        </div>

        {/* Latest Transactions Table */}
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={22} className="text-violet-600 dark:text-violet-500" />
                Recent Orders
              </h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase">Latest store activity</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-black text-secondary hover:bg-secondary/5 px-6 py-3 rounded-2xl transition-all border border-secondary/20 active:scale-95">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full text-left border-separate border-spacing-y-2.5">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.slice(0, 8).map((order: any) => (
                    <tr key={order._id} className="bg-slate-50/50 dark:bg-slate-950/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group rounded-2xl">
                      <td className="px-6 py-5 first:rounded-l-[1.25rem]">
                        <div className="flex items-center gap-3">
                           <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                              <Box size={16} className="text-slate-400" />
                           </div>
                           <span className="text-sm font-black text-slate-900 dark:text-slate-200 font-mono tracking-tight">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-xs font-black text-slate-700 dark:text-slate-300 border border-white dark:border-slate-700 shadow-sm group-hover:rotate-3 transition-transform">
                            {(order.user?.name || "G")[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">{order.user?.name || "Guest"}</span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1"><Mail size={10} className="text-slate-300"/> {order.user?.email || "No Email"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-600 dark:text-slate-400">
                             {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                             {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                          order.status === 'Delivered' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' :
                          order.status === 'Processing' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' :
                          order.status === 'Shipped' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20' :
                          order.status === 'Cancelled' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20' :
                          'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'
                        }`}>
                          <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                             order.status === 'Delivered' ? 'bg-emerald-500' :
                             order.status === 'Processing' ? 'bg-blue-500' :
                             order.status === 'Shipped' ? 'bg-indigo-500' :
                             order.status === 'Cancelled' ? 'bg-rose-500' :
                             'bg-orange-500'
                          }`}></div>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 last:rounded-r-[1.25rem] text-right">
                        <span className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                           <ShoppingBag className="h-12 w-12 text-slate-200 dark:text-slate-800" />
                        </div>
                         <div className="space-y-1">
                          <p className="text-base font-black text-slate-900 dark:text-slate-200">No Orders Found</p>
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Awaiting first store activity</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ChevronRight created locally to avoid import issue dynamically
function ChevronRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
