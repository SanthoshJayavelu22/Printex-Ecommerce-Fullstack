'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fetchApi, getImageUrl } from '@/lib/api'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProducts() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { data } = await fetchApi('/products?limit=4&isActive=true')
        setProducts(data || [])
      } catch (err) {
        console.error('Failed to load featured products', err)
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [])

  useGSAP(() => {
    if (products.length === 0) return

    gsap.fromTo('.featured-header',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )

    gsap.fromTo('.feat-prod-card',
      { opacity: 0, scale: 0.95, y: 100 },
      { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.feat-prod-grid', start: 'top 85%' } }
    )
  }, [products])


  if (loading && products.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] relative overflow-hidden" ref={containerRef}>
      {/* Decorative Blur */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-l from-gray-200/50 to-transparent rounded-full blur-[100px] -z-10 translate-y-1/4" />
      
      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="featured-header flex flex-col md:flex-row justify-between items-end mb-24 gap-12 px-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-black text-black uppercase tracking-tighter mb-6 leading-[0.85] text-balance">
              TRENDING <br /> <span className="text-gray-300">PRODUCTS.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
              Best selling designs this week. Discover what other brands are creating.
            </p>
          </div>
          <Link href="/category/all-products" className="group flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 hover:shadow-[0_10px_30px_rgba(243,119,33,0.2)] transition-all duration-300">
            Full Catalog 
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-secondary transition-colors">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        <div className="feat-prod-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-y-16">
          {products.map((product, i) => (
            <div key={product._id} className={`feat-prod-card ${i % 2 !== 0 ? 'lg:mt-12' : ''}`}>
              <ProductCard 
                id={product._id}
                slug={product.slug}
                name={product.name}
                material={product.defaultMaterial || 'Premium Quality'}
                rating={5}
                price={product.price}
                image={getImageUrl(product.images?.[0])}
                size={product.defaultSize}
                qty={product.defaultQuantity}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
