'use client'

import Link from 'next/link'
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchApi } from '@/lib/api'

export default function MegaMenu() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadTrees = async () => {
      try {
        const res = await fetchApi('/categories/tree');
        setCategories(res.data || []);
      } catch(err) {
        console.error("Failed to fetch menu categories", err);
      }
    };
    loadTrees();
  }, []);

  return (
    <ul className="flex items-center gap-6 lg:gap-8">
      {categories.map((mainCat) => (
        <li key={mainCat._id} className="group py-6">
          <Link
            href={`/category/${mainCat.slug}`}
            className="text-sm font-extrabold uppercase tracking-[0.1em] text-white flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            {mainCat.name}
            {mainCat.children && mainCat.children.length > 0 && (
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            )}
          </Link>

          {mainCat.children && mainCat.children.length > 0 && (
            <div className="absolute left-0 right-0 top-full pointer-events-none opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out z-[100] px-4">
              <div className="mt-2 bg-white rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-slate-100 w-full max-w-7xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
                  <div className="lg:col-span-1.5 border-r border-slate-50 pr-8 hidden lg:block min-w-[180px]">
                     <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4 break-words">
                       {mainCat.name}
                     </h2>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Explore the full range of options & materials.</p>
                     <Link href={`/category/${mainCat.slug}`} className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                       View All <ArrowRight size={12} />
                     </Link>
                  </div>

                  <div className="lg:col-span-4.5 lg:col-start-2 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
                    {mainCat.children.map((subCat: any) => (
                      <div key={subCat._id} className="megamenu-column">
                        <Link href={`/category/${subCat.slug}`} className="block mb-5 pb-3 border-b border-slate-100 hover:border-secondary transition-colors group/sub">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary group-hover/sub:opacity-80 transition-colors flex items-center justify-between">
                            {subCat.name}
                            <ArrowRight size={12} className="opacity-0 group-hover/sub:opacity-100 -translate-x-2 group-hover/sub:translate-x-0 transition-all" />
                          </h3>
                        </Link>
                        
                        {subCat.products && subCat.products.length > 0 && (
                          <ul className="space-y-3">
                            {subCat.products.slice(0, 6).map((item: any) => (
                              <li key={item._id}>
                                <Link
                                  href={`/product/${item.slug}`}
                                  className="text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all inline-block"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                            {subCat.products.length > 6 && (
                               <li>
                                 <Link href={`/category/${subCat.slug}`} className="text-[10px] font-black uppercase text-secondary/60 hover:text-secondary transition-colors">
                                   + {subCat.products.length - 6} More items
                                 </Link>
                               </li>
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
      <li className="relative group py-6">
        <button className="text-sm font-extrabold uppercase tracking-[0.1em] text-white flex items-center gap-1 hover:opacity-80 transition-opacity">
          Company
          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
        </button>
        
        <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 min-w-[160px]">
            <ul className="space-y-1">
              <li>
                <Link href="/about" className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-secondary transition-all">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-secondary transition-all">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  )
}