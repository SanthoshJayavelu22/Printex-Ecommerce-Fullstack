"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi, setAuthToken } from "@/lib/api";
import { Package, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.token) {
        setAuthToken(data.token);
        const meResult = await fetchApi("/auth/me");
        const user = meResult.user;
        
        if (user?.role !== "admin" && user?.role !== "super-admin") {
          throw new Error("Access denied. Administrator privileges required.");
        }
        
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 dark:bg-violet-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-md w-full bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.3)] p-10 sm:p-14 z-10 border border-white dark:border-slate-800 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative h-20 w-20 bg-gradient-to-tr from-indigo-600 to-violet-700 rounded-[1.75rem] flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/20">
              <ShieldCheck size={40} className="text-white drop-shadow-lg" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-6 w-1 bg-indigo-600 rounded-full" />
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Admin Login</h2>
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-center text-[10px] uppercase tracking-[0.3em] ml-1">Secure access required</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-600 transition-colors">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-500 transition-colors" strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="block w-full pl-14 pr-6 py-4.5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-bold text-sm placeholder:text-slate-300 dark:placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-600 transition-colors">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-500 transition-colors" strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-14 pr-6 py-4.5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-bold text-sm placeholder:text-slate-300 dark:placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-5 py-4 rounded-2xl border border-rose-100 dark:border-rose-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center items-center gap-3 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/40 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-95 shadow-lg shadow-indigo-500/10"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </div>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" strokeWidth={3} />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="fixed bottom-8 left-0 right-0 text-center text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] z-10 opacity-50">
        &copy; {new Date().getFullYear()} Printex Labels
      </div>
    </div>
  );
}

// Icon component locally defined to handle imports gracefully
function AlertTriangle(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}
