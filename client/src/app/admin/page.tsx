"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Package, ShoppingBag, Users, AlertTriangle, TrendingUp, IndianRupee, ArrowUpRight, Plus, Box, ShieldCheck, Mail, Calendar, RefreshCw, Clock } from "lucide-react";
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
    <div className={`space-y-12 transition-all duration-700 pb-10 ${loading ? 'opacity-60 blur-sm pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="h-12 w-2.5 bg-primary rounded-full shadow-[0_0_15px_rgba(37,68,65,0.2)]" />
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Terminal Overview</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-base ml-6">Monitor your store's velocity and ecosystem health.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Custom Date Inputs */}
          {dateRange === 'custom' && (
            <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm animate-in zoom-in-95 duration-500">
              <input 
                type="date" 
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-transparent text-[11px] font-black rounded-xl px-4 py-2.5 text-slate-700 dark:text-slate-200 outline-none transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              />
              <span className="text-slate-300 font-black">→</span>
              <input 
                type="date" 
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-transparent text-[11px] font-black rounded-xl px-4 py-2.5 text-slate-700 dark:text-slate-200 outline-none transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              />
            </div>
          )}

          {/* Date Picker Pills */}
          <div className="flex items-center bg-slate-100/50 dark:bg-slate-900/50 p-2 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 shadow-inner group">
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
                className={`whitespace-nowrap px-6 py-3 text-[11px] font-black rounded-[1.25rem] transition-all duration-500 flex items-center justify-center gap-2 ${
                  dateRange === preset.id 
                    ? 'bg-white dark:bg-slate-800 text-primary dark:text-indigo-400 shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.4)] ring-1 ring-slate-200/50 dark:ring-slate-700' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                {preset.id === 'custom' && dateRange === 'custom' && <Calendar size={12} className="text-indigo-500 animate-pulse" />}
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-premium border border-slate-100 dark:border-slate-800 transition-all duration-500 active:scale-[0.98] ${card.glow}`}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] dark:opacity-[0.04] transform translate-x-6 -translate-y-6 group-hover:scale-150 group-hover:-rotate-12 transition-all duration-1000 ease-out">
                <Icon size={160} />
              </div>
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${card.color} shadow-2xl shadow-black/10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex flex-col items-end gap-1`}>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                      card.trend.startsWith('+') 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                    }`}>
                      {card.trend}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{card.subtext}</span>
                  </div>
                </div>
                
                <div className="mt-12">
                  <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:translate-x-1 transition-transform">{card.value}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 gap-10">
        {/* Revenue Analytics Container */}
        {/* <div className="rounded-[3rem] bg-white dark:bg-slate-900 shadow-premium border border-slate-100 dark:border-slate-800 p-12 overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-l from-primary/5 dark:from-primary/10 to-transparent pointer-events-none" />
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
           
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                    <TrendingUp size={24} />
                  </div>
                  Revenue Analytics
                </h2>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-wide ml-16">High-fidelity sales performance and forecasting</p>
              </div>
              <button className="px-8 py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-primary/20 flex items-center gap-3">
                <ArrowUpRight size={16} /> Generate Report
              </button>
           </div>

           <div className="h-96 w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 group/canvas relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-1000" />
              <div className="text-center group-hover/canvas:scale-110 transition-transform duration-700 relative z-10">
                <div className="bg-white dark:bg-slate-900 shadow-2xl w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-800">
                  <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                </div>
                <p className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Synthesizing Visual Analytics...</p>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-3 max-w-[280px] mx-auto uppercase tracking-widest leading-relaxed">Processing massive dataset to render real-time financial fluctuations</p>
              </div>
           </div>
        </div> */}

        {/* Latest Transactions Modern Table */}
        <div className="rounded-[3rem] bg-white dark:bg-slate-900 shadow-premium border border-slate-100 dark:border-slate-800 overflow-hidden relative">
          <div className="p-10 pb-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                <div className="p-3 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-500 rounded-2xl">
                  <ShoppingBag size={24} />
                </div>
                Recent Activity
              </h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase ml-16">Intelligence Stream</p>
            </div>
            <Link href="/admin/orders" className="text-[11px] font-black text-primary hover:bg-primary/5 px-8 py-4 rounded-[1.5rem] transition-all border border-primary/20 active:scale-95 uppercase tracking-widest group">
              Explore All <ArrowUpRight size={14} className="inline ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto px-6 pb-12 pt-4">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500">
                  <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.25em]">Manifest ID</th>
                  <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.25em]">Customer Profile</th>
                  <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.25em]">Timestamp</th>
                  <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.25em]">State</th>
                  <th className="px-8 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.slice(0, 8).map((order: any) => (
                    <tr key={order._id} className="bg-slate-50/50 dark:bg-slate-950/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group/row rounded-[2rem] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                      <td className="px-8 py-6 first:rounded-l-[2.5rem]">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm group-hover/row:scale-110 transition-transform">
                              <Box size={20} className="text-slate-400 dark:text-slate-500" />
                           </div>
                           <span className="text-sm font-black text-slate-900 dark:text-slate-200 tracking-tighter">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-sm font-black text-primary dark:text-indigo-400 border border-slate-100 dark:border-slate-700 shadow-sm group-hover/row:rotate-6 transition-transform">
                            {(order.user?.name || "G")[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-base font-black text-slate-900 dark:text-slate-100 truncate max-w-[180px]">{order.user?.name || "Guest User"}</span>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5"><Mail size={12} className="text-slate-300 dark:text-slate-600"/> {order.user?.email || "No digital contact"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-300">
                             {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 flex items-center gap-1">
                             <Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm ${
                          order.status === 'Delivered' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' :
                          order.status === 'Processing' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' :
                          order.status === 'Shipped' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20' :
                          order.status === 'Cancelled' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20' :
                          'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20'
                        }`}>
                          <div className={`h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${
                             order.status === 'Delivered' ? 'bg-emerald-500' :
                             order.status === 'Processing' ? 'bg-blue-500' :
                             order.status === 'Shipped' ? 'bg-indigo-500' :
                             order.status === 'Cancelled' ? 'bg-rose-500' :
                             'bg-orange-500'
                          }`}></div>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 last:rounded-r-[2.5rem] text-right">
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter group-hover/row:text-primary transition-colors">
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-inner group">
                           <ShoppingBag className="h-16 w-16 text-slate-200 dark:text-slate-800 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                         <div className="space-y-2">
                          <p className="text-xl font-black text-slate-900 dark:text-slate-200 uppercase tracking-tighter">Velocity Zero</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] max-w-xs mx-auto">Awaiting first store interaction to populate the intelligence stream</p>
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
