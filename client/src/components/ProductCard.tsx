'use client'

import { Plus, ShoppingBag, Eye, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  slug: string
  name: string
  material: string
  rating: number
  price: number
  image: string
  size?: string
  qty?: number
  layout?: 'grid' | 'list'
}

export default function ProductCard({ id, slug, name, material, rating, price, image, size, qty, layout = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      await addToCart({
        productId: id,
        quantity: qty || 100,
        selectedSize: size || '2x2"',
      })
      // Optional: Show success toast or feedback
    } catch (err: any) {
      alert(err.message || 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  if (layout === 'list') {
    return (
      <div 
        className="group relative flex flex-col sm:flex-row bg-white transition-all duration-300 shadow-sm border border-slate-100 rounded-[2rem] p-4 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        onClick={() => router.push(`/product/${slug}`)}
      >
        <div className="relative h-48 w-48 shrink-0 bg-slate-50 rounded-[1.5rem] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
          />
        </div>
        
        <div className="flex flex-col flex-1 justify-center px-4 sm:px-6 mt-4 sm:mt-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{material}</p>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                {name}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-slate-900 italic">₹{price}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Starting At</p>
            </div>
          </div>
          
          <div className="flex gap-2 mb-6">
            <span className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">Size: {size || '2x2"'}</span>
            <span className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">Qty: {qty || 100}</span>
          </div>

          <div className="flex gap-3 mt-auto">
            <button 
              disabled={loading}
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingBag size={14} />} Add to Cart
            </button>
            <button className="h-10 px-4 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-full hover:bg-slate-50 transition-colors">
              Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative flex flex-col bg-white transition-all duration-700 cursor-pointer"
      onClick={() => router.push(`/product/${slug}`)}
    >
      {/* Image Container */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-50 rounded-[2.5rem] mb-8">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-6 bottom-6 flex gap-3 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
          <button 
            disabled={loading}
            onClick={handleAddToCart}
            className="flex-1 bg-secondary text-white py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-2xl disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add to Cart
          </button>
          <button className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-xl active:scale-95">
            <Eye size={20} />
          </button>
        </div>

        {/* Floating Tag */}
        <div className="absolute top-6 left-6 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-sm">
          Limited Series
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-col gap-3 px-2">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{material}</p>
            <h3 className="text-xl font-black text-black uppercase tracking-tight leading-tight group-hover:tracking-wider transition-all duration-700">
              {name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-black italic">₹{price}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Starting At</p>
          </div>
        </div>

        {/* Size and Qty Badges */}
        <div className="flex gap-2 mt-4">
          <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-black">Size: {size || '2x2"'}</span>
          <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-black">Qty: {qty || 100}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-black/5">
           <button className="flex-1 border border-black/10 text-[10px] font-black uppercase tracking-widest text-black py-3 rounded-full hover:bg-black hover:text-white transition-colors">
              Upload Artwork
           </button>
        </div>
      </div>
    </div>
  )
}

