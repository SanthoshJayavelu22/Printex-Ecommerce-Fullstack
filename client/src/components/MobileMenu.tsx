'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronDown, Search, User, Heart, ArrowRight } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!isOpen) return null

  const toggleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto page-transition">
      <div className="flex justify-between items-center p-8 border-b border-gray-50">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary uppercase" onClick={onClose}>
          Printex Labels<span className="text-secondary">.</span>
        </Link>
        <button onClick={onClose} className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center">
          <X size={24} />
        </button>
      </div>

      <div className="p-8">
        {/* Mobile Search - Modern Minimalist */}
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Search our catalog"
            className="w-full border-b-2 border-primary/10 py-4 text-lg font-bold uppercase tracking-tight focus:border-secondary focus:outline-none placeholder:text-gray-300 transition-all text-primary"
          />
          <Search className="absolute right-0 top-4 text-primary" size={20} />
        </div>

        {/* Mobile Menu Items - High Impact Typography */}
        <ul className="space-y-8">
          <li>
            <Link href="/" className="text-4xl font-bold uppercase tracking-tighter text-primary flex items-center justify-between group" onClick={onClose}>
              Home <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-secondary" />
            </Link>
          </li>

          <li>
            <button
              onClick={() => toggleExpand('shop')}
              className="text-4xl font-bold uppercase tracking-tighter text-primary flex items-center justify-between w-full text-left"
            >
              Shop <ChevronDown size={24} className={`transition-transform duration-500 text-secondary ${expanded === 'shop' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${expanded === 'shop' ? 'max-h-[1000px] mt-8' : 'max-h-0'}`}>
              <div className="flex flex-col gap-6 pl-4 border-l-2 border-black/5">
                {['Custom Stickers', 'Barcode Labels', 'Packaging Sleeves', 'Business Cards', 'Sample Kits'].map(item => (
                    <Link 
                      key={item} 
                      href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="text-xl font-bold text-slate-400 uppercase tracking-tight hover:text-secondary transition-colors" 
                      onClick={onClose}
                    >
                      {item}
                    </Link>
                ))}
              </div>
            </div>
          </li>

          <li>
             <Link href="/bulk" className="text-4xl font-bold uppercase tracking-tighter text-primary flex items-center justify-between group" onClick={onClose}>
              Bulk Order <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-secondary" />
            </Link>
          </li>
          <li>
             <Link href="/track" className="text-4xl font-bold uppercase tracking-tighter text-primary flex items-center justify-between group" onClick={onClose}>
              Track <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-secondary" />
            </Link>
          </li>
          <li>
             <Link href="/about" className="text-4xl font-bold uppercase tracking-tighter text-primary flex items-center justify-between group" onClick={onClose}>
              Studio <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-secondary" />
            </Link>
          </li>
        </ul>

        {/* Auth & Utility */}
        <div className="mt-20 pt-10 border-t border-primary/5 flex flex-wrap gap-8">
          <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors">
            <User size={18} /> Account
          </button>
          <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-secondary transition-colors">
            <Heart size={18} /> Favorites
          </button>
        </div>
      </div>
    </div>
  )
}