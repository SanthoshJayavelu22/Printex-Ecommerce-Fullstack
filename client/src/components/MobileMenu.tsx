'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ChevronDown, Search, User, LogOut, ShoppingBag, ArrowRight, UserCircle } from 'lucide-react'
import { fetchApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const { user, logout } = useAuth()
  const { cart } = useCart()

  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const res = await fetchApi('/categories/tree')
          setCategories(res.data || [])
        } catch (err) {
          console.error("Failed to fetch mobile menu categories", err)
        }
      }
      loadCategories()
    }
  }, [isOpen])

  if (!isOpen) return null

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-primary overflow-y-auto page-transition text-white">
      {/* Header Area */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 backdrop-blur-xl sticky top-0 bg-primary/95">
        <Link href="/" className="text-xl font-black tracking-tighter text-white uppercase" onClick={onClose}>
          Printix Labels<span className="text-secondary">.</span>
        </Link>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 pb-20">
        {/* User Status Section */}
        {user ? (
          <div className="mb-10 bg-white/5 rounded-3xl p-6 border border-white/5">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-black text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Welcome back</p>
                  <p className="text-lg font-black text-white">{user.name}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/profile" 
                  onClick={onClose}
                  className="bg-white/5 hover:bg-white/10 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all"
                >
                  Profile
                </Link>
                <button 
                  onClick={() => { logout(); onClose(); }}
                  className="bg-red-500/10 hover:bg-red-500/20 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 text-center transition-all"
                >
                  Logout
                </button>
             </div>
          </div>
        ) : (
          <Link 
            href="/login" 
            onClick={onClose}
            className="mb-10 flex items-center justify-between bg-secondary p-6 rounded-3xl group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
               <UserCircle className="w-8 h-8" />
               <div>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Get Started</p>
                  <p className="text-lg font-black text-white">Sign In / Register</p>
               </div>
            </div>
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {/* Categories Navigation */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 ml-2">Product Categories</p>
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li key={cat._id} className="border-b border-white/5 pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className="text-2xl font-black uppercase tracking-tight text-white hover:text-secondary transition-colors"
                    onClick={onClose}
                  >
                    {cat.name}
                  </Link>
                  {cat.children && cat.children.length > 0 && (
                    <button 
                      onClick={() => toggleExpand(cat._id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all"
                    >
                      <ChevronDown size={20} className={`text-secondary transition-transform duration-300 ${expanded === cat._id ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                
                {cat.children && cat.children.length > 0 && (
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded === cat._id ? 'max-h-[1000px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-4 pl-4 border-l border-white/10">
                      {cat.children.map((sub: any) => (
                        <li key={sub._id}>
                          <Link 
                            href={`/category/${sub.slug}`}
                            className="text-sm font-bold text-white/60 hover:text-secondary transition-colors flex items-center justify-between"
                            onClick={onClose}
                          >
                            {sub.name}
                            <ArrowRight size={14} className="opacity-40" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div className="mt-12 space-y-4 pt-8 border-t border-white/5">
           <Link href="/cart" onClick={onClose} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Shopping Cart</span>
              </div>
              <span className="bg-secondary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {cart?.totalItems || 0} Items
              </span>
           </Link>
           <div className="grid grid-cols-2 gap-4">
              <Link href="/about" onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-secondary p-4 border border-white/5 rounded-2xl text-center">About Us</Link>
              <Link href="/contact" onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-secondary p-4 border border-white/5 rounded-2xl text-center">Contact Us</Link>
           </div>
        </div>
      </div>
    </div>
  )
}