'use client'

import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const shapes = [
  { name: 'Round Stickers', price: 'From ₹199', icon: '●', href: '/shape/round' },
  { name: 'Square Stickers', price: 'From ₹199', icon: '■', href: '/shape/square' },
  { name: 'Rectangle Stickers', price: 'From ₹199', icon: '▬', href: '/shape/rectangle' },
  { name: 'Die Cut Stickers', price: 'From ₹249', icon: '⬟', href: '/shape/die-cut' },
  { name: 'Oval Stickers', price: 'From ₹219', icon: '⬭', href: '/shape/oval' },
  { name: 'Custom Shape', price: 'Get Quote', icon: '✦', href: '/shape/custom' },
]

export default function ShapeSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.shape-header', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )

    gsap.fromTo('.shape-card',
      { opacity: 0, scale: 0.8, y: 50 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.shape-grid', start: 'top 85%' }
      }
    )
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden" ref={containerRef}>
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gray-100/50 to-gray-50/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="shape-header flex flex-col md:flex-row justify-between items-end mb-20 px-4 gap-8">
          <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-[0.85]">Shop Stickers <br /> <span className="text-gray-300">by Shape.</span></h2>
          <p className="max-w-xs text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Find the perfect shape for your brand.
          </p>
        </div>
        
        <div className="shape-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {shapes.map((shape, i) => (
            <Link 
              key={shape.name} 
              href={shape.href}
              className="shape-card group relative h-72 lg:h-80 bg-[#FAFAFA] border border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-8 overflow-hidden transition-all duration-700 hover:bg-black hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-4"
            >
              <div className="text-7xl text-black group-hover:text-white group-hover:scale-[1.3] group-hover:-rotate-12 transition-all duration-[800ms] ease-out font-light relative z-10">
                {shape.icon}
              </div>
              
              <div className="flex flex-col items-center gap-2 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-gray-500 transition-colors">
                  {shape.price}
                </span>
                <span className="text-sm font-black uppercase tracking-tight text-black group-hover:text-white transition-colors">
                  {shape.name}
                </span>
              </div>

              {/* Hover Indicator */}
              <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
                <ArrowRight size={24} className="text-white" />
              </div>

              {/* Glass background for token */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}