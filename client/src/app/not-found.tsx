import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft, Home, Search, Package } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-44 pb-24 flex items-center justify-center relative overflow-hidden bg-white dark:bg-slate-950">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 dark:bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-50/50 dark:bg-orange-500/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="mb-12 relative inline-block">
             <h1 className="text-[12rem] md:text-[18rem] font-black text-slate-100 dark:text-slate-900 leading-none select-none tracking-tighter">404</h1>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Whoops!</span>
             </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight mb-6">The page you're looking for has been peeled away.</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto mb-12 text-balance lg:text-lg"> It looks like the link you followed is broken or the page has been moved. Don't worry, even the best labels need a little repositioning sometimes.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link 
              href="/"
              className="group flex items-center gap-3 bg-indigo-600 hover:bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-indigo-500/20 active:scale-95"
            >
              <Home size={18} /> Back to Home
            </Link>
            <Link 
              href="/category/all-products"
              className="group flex items-center gap-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all active:scale-95"
            >
              <Package size={18} /> Browse Products
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Popular Destinations</p>
             <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                <Link href="/orders" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">Track Order</Link>
                <Link href="/profile" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">My Account</Link>
                <Link href="/wishlist" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">Wishlist</Link>
                <Link href="/contact" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">Contact Support</Link>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
