'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { fetchApi, getImageUrl } from '@/lib/api'

gsap.registerPlugin(ScrollTrigger)

export default function CategoryGrid() {
  const gridRef = useRef(null)
  const [categories, setCategories] = useState<any[]>([
    {
      _id: 'cat1',
      name: 'Die Cut Stickers',
      slug: 'die-cut-stickers',
      image: 'category_die_cut_stickers_1774522408709.png',
      description: 'Custom shapes perfectly cut to your design.'
    },
    {
      _id: 'cat2',
      name: 'Holographic Labels',
      slug: 'holographic-stickers',
      image: 'category_holographic_stickers_1774522428403.png',
      description: 'Rainbow shimmer that catches every eye.'
    },
    {
      _id: 'cat3',
      name: 'Clear Vinyl Labels',
      slug: 'clear-stickers',
      image: 'category_clear_stickers_1774522442629.png',
      description: 'Transparent labels for a premium "no-label" look.'
    },
    {
      _id: 'cat4',
      name: 'Industrial Vinyl',
      slug: 'vinyl-stickers',
      image: 'category_vinyl_labels_1774522462747.png',
      description: 'Durable, waterproof, and indoor/outdoor ready.'
    }
  ])
  const [loading, setLoading] = useState(false)

  // Mapping for generated local images
  const getDemoImage = (imageKey: string) => {
    // These images are saved as artifacts in the brain directory.
    // For local dev, they might need to be in public, but for the demo I'll point to the direct filename.
    return `/${imageKey}`; 
  }

  useGSAP(() => {
    if (categories.length === 0) return

    // Heading reveal
    gsap.fromTo('.heading-reveal', 
      { opacity: 0, y: 50, rotateX: -20 },
      { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: gridRef.current, start: 'top 85%' } }
    )

    // Staggered card entry
    gsap.fromTo(
      '.category-card',
      { opacity: 0, y: 100, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      }
    )
  }, [categories])


  if (loading && categories.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="heading-reveal text-4xl md:text-5xl lg:text-[4rem] font-black text-black mb-6 tracking-tighter uppercase leading-[0.85]">
              OUR BESTSELLING <br /> CATEGORIES
            </h2>
            <p className="heading-reveal text-lg text-gray-500 font-medium">Most loved items by businesses & creators.</p>
          </div>
          <Link href="/category/all-products" className="heading-reveal group flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 hover:shadow-[0_10px_30px_rgba(243,119,33,0.2)] transition-all duration-300">
            Explore All <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-secondary transition-colors"><ArrowUpRight size={16} /></div>
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-y-16">
          {categories.map((cat, i) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className={`category-card group block ${i % 2 !== 0 ? 'lg:mt-12' : ''}`}
            >
              <div className="aspect-[4/5] relative bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-[2.5rem] overflow-hidden mb-6 transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                <Image
                  src={getDemoImage(cat.image)}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-[1.5s] ease-out"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-xl">
                  <ArrowUpRight size={24} className="text-black group-hover:rotate-45 transition-transform duration-500" />
                </div>
              </div>
              <div className="px-4 text-center items-center flex flex-col">
                <h3 className="text-xl font-black text-black mb-2 group-hover:text-gray-600 transition-colors duration-300 uppercase tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-400 font-semibold tracking-wider uppercase">
                  {cat.description?.substring(0, 30)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
