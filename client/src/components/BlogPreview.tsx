'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const posts = [
  {
    title: 'How to Choose the Right Sticker Material',
    excerpt: 'Vinyl vs paper: which one suits your product?',
    date: 'Jan 12, 2026',
    category: 'Guide',
    image: '/images/materials.png',
  },
  {
    title: 'Vinyl vs Paper Stickers – Pros & Cons',
    excerpt: 'Durability, finish and cost comparison.',
    date: 'Jan 5, 2026',
    category: 'Comparison',
    image: '/images/custom_stickers.png',
  },
  {
    title: 'Best Sticker Sizes for Packaging',
    excerpt: 'Standard dimensions for boxes, pouches and more.',
    date: 'Dec 28, 2025',
    category: 'Tips',
    image: '/images/packaging_sleeves.png',
  },
]

export default function BlogPreview() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.blog-header',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )

    gsap.fromTo('.blog-card',
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.blog-grid', start: 'top 85%' } }
    )
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden" ref={containerRef}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-orange-50/50 to-transparent rounded-full blur-[100px] -z-10" />

      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="blog-header flex flex-col md:flex-row justify-between items-end mb-24 gap-12 px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/5 bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-8 backdrop-blur-md">
              Knowledge Base
            </div>
            <h2 className="text-5xl md:text-[5.5rem] lg:text-[6.5rem] font-black text-black uppercase tracking-tighter mb-8 leading-[0.85] text-balance">
              Printing Tips & <br /> <span className="text-secondary">Guides.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
              Deep dives into the intersection of digital branding, industrial 
              precision, and sustainable packaging.
            </p>
          </div>
          <Link href="/blog" className="group flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 hover:shadow-[0_10px_30px_rgba(37,68,65,0.25)] transition-all duration-300">
            The Archive
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {posts.map((post, i) => (
            <Link key={i} href="/blog/post" className="blog-card group flex flex-col gap-8 transition-all duration-700 hover:-translate-y-4">
              <div className="aspect-[16/11] relative rounded-[3rem] overflow-hidden bg-gray-50 shadow-sm border border-transparent group-hover:border-gray-100 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[1.5s] ease-out"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-6 left-6 px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-lg">
                  {post.category}
                </div>
              </div>
              
              <div className="px-4">
                <div className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <Calendar size={14} />
                  </span>
                  {post.date}
                </div>
                <h3 className="text-3xl font-black text-black uppercase tracking-tight mb-4 leading-tight group-hover:text-gray-600 transition-colors duration-500">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed line-clamp-2 font-medium mb-8">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-3 text-black text-[10px] font-black uppercase tracking-[0.3em] group-hover:gap-6 group-hover:text-secondary transition-all duration-500">
                  Read Article 
                  <span className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-colors duration-500">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}