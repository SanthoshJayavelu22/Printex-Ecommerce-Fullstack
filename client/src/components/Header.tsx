'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, Menu, PackageOpen, Zap, ShieldCheck, Phone, Mail, User, LogOut, ChevronDown, X } from 'lucide-react'
import MegaMenu from './MegaMenu'
import MobileMenu from './MobileMenu'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/contexts/SettingsContext'
import logo from '../../public/images/printex-labels-logo.png'

export default function Header() {
  const { settings } = useSettings()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700`}>
      {/* Topbar */}
      <div className={`bg-primary text-white transition-all duration-700 overflow-hidden ${isScrolled ? 'h-0 py-0 opacity-0' : 'h-auto py-2 opacity-100'} hidden lg:block text-[10px] font-black uppercase tracking-widest`}>
        <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 flex justify-between items-center">
          <div className="flex items-center gap-6 xl:gap-8">
            <span className="flex items-center gap-2"><PackageOpen size={14} className="text-gray-400" /> Free Shipping above ₹1499</span>
            <span className="flex items-center gap-2"><Zap size={14} className="text-gray-400" /> Fast Dispatch</span>
            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-gray-400" /> 100% Quality</span>
          </div>
          <div className="flex items-center gap-6 xl:gap-8">
            <a href={`tel:${settings?.contactPhone || '+91 98765 43210'}`} className="flex items-center gap-2 hover:text-gray-300">
               <Phone size={14} className="text-gray-400" /> {settings?.contactPhone || '+91 98765 43210'}
            </a>
            <a href={`mailto:${settings?.contactEmail || 'info@printexlabels.com'}`} className="flex items-center gap-2 hover:text-gray-300">
               <Mail size={14} className="text-gray-400" /> {settings?.contactEmail || 'info@printexlabels.com'}
            </a>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-700 ${isScrolled ? 'py-1' : 'py-3'}`}>
        <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24">
          <div className={`rounded-full px-6 md:px-8 py-1.5 md:py-2 flex items-center justify-between transition-all duration-700 border border-white/10 shadow-2xl overflow-visible backdrop-blur-xl bg-primary text-white`}>
            <Link href="/" className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-3 group">
              {
              settings?.logo ? 
              (
                <img src={settings.logo} alt={settings.storeName} className="h-10 w-auto object-contain" />
              ) : 
              (
                 <>{settings?.storeName || 'Printex Labels'}<span className="text-gray-400 group-hover:text-black transition-colors duration-500">.</span></>
              )}
            </Link>

          <nav className="hidden lg:block">
            <MegaMenu />
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <div className={`flex items-center bg-white/10 rounded-full transition-all duration-500 overflow-hidden ${isSearchOpen ? 'w-48 sm:w-64 px-4' : 'w-10'}`}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
                title="Search Products"
              >
                {isSearchOpen ? <X size={18} className="text-white" /> : <Search size={18} className="text-white" />}
              </button>
              {isSearchOpen && (
                <form onSubmit={handleSearch} className="flex-1">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search Labels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs font-bold w-full h-full py-2 placeholder:text-white/40 text-white"
                  />
                </form>
              )}
            </div>
            
            {user ? (
              <div className="flex items-center gap-4 relative group/user">
                <button className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-secondary transition-colors py-2">
                  My Account
                  <ChevronDown size={12} className="group-hover/user:rotate-180 transition-transform" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/user:opacity-100 group-hover/user:translate-y-0 group-hover/user:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 min-w-[180px]">
                    <div className="border-b border-slate-50 pb-3 mb-3 px-2">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                       <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-secondary transition-all">
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link href="/orders" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-secondary transition-all">
                          Order History
                        </Link>
                      </li>
                      <li>
                        <Link href="/addresses" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-secondary transition-all">
                          Saved Addresses
                        </Link>
                      </li>
                      <li className="pt-2 border-t border-slate-50 mt-2">
                        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all w-full text-left">
                          <LogOut size={14} /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-secondary transition-colors">
                <User size={18} className="text-white" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            <Link href="/cart" className="relative group w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-all">
              <ShoppingBag size={18} className="text-white group-hover:scale-110 transition-transform" />
              {cart && cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-secondary text-white text-[9px] flex items-center justify-center rounded-full font-black animate-in fade-in zoom-in shadow-sm">
                  {cart.totalItems}
                </span>
              )}
            </Link>
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-white transition-all hover:scale-105 active:scale-95"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}
