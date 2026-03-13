"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, List, Users, LogOut, Package, Menu, X, ChevronRight, Bell, Moon, Sun, Tag, Star, Image as ImageIcon, Settings, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthToken, removeAuthToken, fetchApi } from "@/lib/api";
import { useTheme } from "next-themes";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: List },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/contacts", label: "Inquiries", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
        return;
      }

      try {
        const result = await fetchApi("/auth/me");
        const user = result.user;
        if (user?.role !== "admin" && user?.role !== "super-admin") {
          removeAuthToken();
          if (pathname !== "/admin/login") {
            router.replace("/admin/login");
          }
          return;
        }
      } catch (error: any) {
        if (error.status === 401 || error.message === 'Unauthorized request') {
          removeAuthToken();
          if (pathname !== "/admin/login") {
            router.replace("/admin/login");
          }
          return;
        }
      }
      // If we got here and didn't redirect, we are authorized
      if (pathname !== "/admin/login") {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Close sidebar on path change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    removeAuthToken();
    router.push("/admin/login");
  };

  return (
    <div className="flex bg-[#f8fafc] dark:bg-[#020617] min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 w-72 h-screen bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-24 shrink-0 items-center justify-between px-8">
          <Link href="/admin" className="flex items-center gap-3.5 group">
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-primary dark:text-white">
                Printex Admin
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Admin Panel</span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
          <section>
            <p className="px-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Menu</p>
            <nav className="space-y-1.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? "bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] text-primary dark:text-primary border border-slate-100 dark:border-slate-700/50" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-primary/5 hover:text-primary dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4.5">
                      <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        <Icon size={20} className={`transition-colors duration-300 ${isActive ? "text-primary dark:text-primary" : "text-slate-400 group-hover:text-secondary dark:group-hover:text-primary"}`} />
                      </div>
                      <span className={`text-sm font-semibold transition-all duration-300 ${isActive ? 'translate-x-0.5' : ''}`}>{link.label}</span>
                    </div>
                    {isActive && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(243,119,33,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </section>

          {/* Quick Stats or Promo Mini-Card */}
          <section className="px-2">
            <div className="bg-primary rounded-[2rem] p-6 text-white overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mb-1">Growth</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black">+24%</span>
                  <span className="text-[10px] text-indigo-100/80">this month</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6">
          <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-4 mb-4 group hover:bg-white dark:hover:bg-slate-800 transition-all duration-500">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 shadow-sm group-hover:rotate-6 transition-all">
                A
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Administrator</p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate opacity-70">Admin Access</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2.5 px-6 py-4 text-xs font-bold text-rose-600/90 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-500/5 hover:bg-rose-100 dark:hover:bg-rose-500/10 rounded-2xl transition-all duration-300 uppercase tracking-widest active:scale-95"
          >
            <LogOut size={16} />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative Background Blob */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header */}
        <header className={`sticky top-0 z-30 flex h-24 items-center justify-between px-8 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-4' 
            : 'bg-transparent py-6'
        }`}>
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="lg:hidden p-3 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 shadow-sm rounded-2xl transition-all border border-slate-200 dark:border-slate-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="hidden sm:flex flex-col">
              <h1 className="text-xl font-black text-primary dark:text-white capitalize flex items-center gap-3">
                {pathname.split('/').pop() === 'admin' ? 'Dashboard Overview' : pathname.split('/').pop()}
                <div className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(243,119,33,0.6)]" />
              </h1>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Logged in as Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search or Notifications could go here */}
            <button className="p-3 text-slate-400 hover:text-secondary hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
               <Bell size={20} />
            </button>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="group relative p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-secondary dark:hover:text-secondary rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-500 overflow-hidden"
              >
                <div className="relative z-10">
                  {theme === 'dark' ? <Sun size={20} className="animate-in spin-in-90 duration-500" /> : <Moon size={20} className="animate-in spin-in-90 duration-500" />}
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-12">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
