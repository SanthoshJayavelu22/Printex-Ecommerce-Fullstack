'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search, Box, Flame, ShieldAlert, Tag, Sparkles, Droplets, Layers } from 'lucide-react'

interface MaterialOption {
  name: string;
  category: string;
}

const MATERIAL_CATEGORIES = [
  {
    id: 'paper',
    name: 'Paper Labels',
    icon: <Box size={16} />,
    options: ['Chromo Paper', 'Mirror Coated Chromo', 'Gold Paper', 'Kraft Paper', 'Fluorescent Paper']
  },
  {
    id: 'film',
    name: 'Film Labels',
    icon: <Droplets size={16} />,
    options: ['Polyester (PET)', 'Silver Polyester', 'Transparent Film', 'Synthetic Matt']
  },
  {
    id: 'security',
    name: 'Security Labels',
    icon: <ShieldAlert size={16} />,
    options: ['Grey Void', 'Ultra Destructible Vinyl (UDV)', 'Hologram Labels', 'Scratch Labels']
  },
  {
    id: 'tag',
    name: 'Tag Materials',
    icon: <Tag size={16} />,
    options: ['Chromo Tag Board', 'Synthetic Tag Board']
  },
  {
    id: 'lamination',
    name: 'Lamination & Finishing',
    icon: <Layers size={16} />,
    options: [
      'Glossy Lamination (1 Mil)', 
      'Matt Lamination (1 Mil)', 
      '2 Mil Lamination', 
      'Sand Matt Lamination', 
      'Velvet Lamination', 
      'Gold Foiling', 
      'Silver Foiling'
    ]
  },
  {
    id: 'adhesive',
    name: 'Adhesive Types',
    icon: <Droplets size={16} />,
    options: ['Standard Adhesive', 'Front Adhesive (Reverse Gumming)', 'Piggyback Labels']
  },
  {
    id: 'special',
    name: 'Special Application Labels',
    icon: <Sparkles size={16} />,
    options: [
      'Camera Block Stickers', 
      'Tyre Labels', 
      'Wire & Cable Labels', 
      'Jewellery Labels', 
      'Direct Thermal Labels', 
      'Asset Tracking Labels', 
      'Cryogenic Labels', 
      'Fragile Stickers', 
      'Wet Wipes Labels'
    ]
  }
]

interface MaterialSelectorProps {
  selected: string;
  onSelect: (value: string) => void;
  error?: boolean;
  availableMaterials?: string[];
  disabled?: boolean;
}

export default function MaterialSelector({ selected, onSelect, error, availableMaterials, disabled }: MaterialSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allCategorizedOptions = MATERIAL_CATEGORIES.flatMap(cat => cat.options);
  const otherOptions = availableMaterials?.filter(opt => !allCategorizedOptions.includes(opt)) || [];

  const displayCategories = [...MATERIAL_CATEGORIES];
  if (otherOptions.length > 0) {
    displayCategories.push({
      id: 'other',
      name: 'Additional Options',
      icon: <Sparkles size={16} />,
      options: otherOptions
    });
  }

  const filteredCategories = displayCategories.map(cat => ({
    ...cat,
    options: cat.options.filter(opt => {
      const matchesSearch = opt.toLowerCase().includes(searchQuery.toLowerCase());
      const isAvailable = !availableMaterials || availableMaterials.length === 0 || availableMaterials.includes(opt);
      return matchesSearch && isAvailable;
    })
  })).filter(cat => cat.options.length > 0)

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between bg-white border rounded-xl p-4 text-left transition-all focus:ring-2 focus:ring-primary/20 outline-none ${
          error ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : 'border-slate-200 hover:border-slate-300'
        } ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Material</span>
          <span className={`text-sm font-black tracking-tight ${selected ? 'text-slate-800' : 'text-slate-400 font-bold'}`}>
            {selected || 'Select Material'}
          </span>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[500] bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div key={cat.id} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">
                    {cat.icon}
                    {cat.name}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {cat.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          onSelect(opt)
                          setIsOpen(false)
                          setSearchQuery('')
                        }}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                          selected === opt 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {selected === opt && <Check size={14} className="shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs font-bold text-slate-400">No materials found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Premium Selection</p>
             <div className="flex -space-x-1">
                {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full border border-white bg-slate-200 shadow-sm" />)}
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
