"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { List, Search, RefreshCw, User, Calendar, ExternalLink, Shield } from "lucide-react";

export default function AdminActivities() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/activities");
      if (res.success) {
        setLogs(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load activity logs", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Activity Logs</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">
            Audit trail of administrative actions for security and tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={loadLogs}
                className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all active:scale-90"
            >
                <RefreshCw size={18} className={`text-slate-400 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            </button>
        </div>
      </div>

      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 pb-4">
          <div className="relative w-full max-w-lg group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500" />
            </div>
            <input
              type="text"
              placeholder="Filter by action, admin, or module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-950/50 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto px-6 py-4">
          {loading ? (
            <div className="p-24 text-center">
               <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
               <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Scanning History...</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500">
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Administrator</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Action</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Module</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Details</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {filteredLogs.length > 0 ? filteredLogs.map((log: any) => (
                  <tr key={log._id} className="bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                    <td className="px-6 py-4 first:rounded-l-[1.5rem]">
                        <div className="flex items-center gap-3">
                            <Calendar size={14} className="text-slate-400" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {new Date(log.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400">
                                    {new Date(log.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                <User size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                    {log.user?.name || "System"}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 italic">
                                    {log.user?.role || "Automatic"}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            log.action.includes('Delete') ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            log.action.includes('Update') ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                            {log.action}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {log.module}
                        </span>
                    </td>
                    <td className="px-6 py-4 last:rounded-r-[1.5rem]">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 line-clamp-1 max-w-xs">{log.details}</p>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                       <div className="p-10 bg-slate-50 dark:bg-slate-950/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 max-w-sm mx-auto">
                        <Shield size={40} className="text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">No activities recorded</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">All administrative actions will appear here once performed.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
