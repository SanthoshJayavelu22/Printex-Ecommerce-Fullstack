'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const materials = [
  { name: 'Matte Finish', desc: 'From ₹199', href: '/material/matte', image: '/images/matte_finish.png' },
  { name: 'Glossy Finish', desc: 'From ₹199', href: '/material/glossy', image: '/images/glossy_finish.png' },
  { name: 'Transparent', desc: 'From ₹249', href: '/material/transparent', image: '/images/transparent_finish.png' },
  { name: 'Vinyl', desc: 'From ₹299', href: '/material/vinyl', image: 'https://images.unsplash.com/photo-1510414696678-2415ad8474aa?w=800&q=80' },
  { name: 'Holographic', desc: 'From ₹399', href: '/material/holographic', image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&q=80' },
  { name: 'Waterproof', desc: 'From ₹279', href: '/material/waterproof', image: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?w=800&q=80' },
]

export default function MaterialSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.material-header',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )
    
    gsap.fromTo('.material-card',
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.material-grid', start: 'top 85%' } }
    )
  }, [])

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] relative overflow-hidden" ref={containerRef}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-gray-200/50 to-transparent rounded-full blur-[100px] -z-10" />

      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="material-header max-w-3xl mb-24">
          <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-black uppercase tracking-tighter mb-8 leading-[0.85]">Choose Your <br /> <span className="text-gray-300">Material.</span></h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
            Durable, vibrant, and made to last.
          </p>
        </div>

        <div className="material-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {materials.map((mat) => (
            <Link 
              key={mat.name} 
              href={mat.href}
              className="material-card group block relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            >
              <Image
                src={mat.image}
                alt={mat.name}
                fill
                className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[1.5s] ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated Inner Content */}
              <div className="absolute inset-x-8 bottom-8 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{mat.name}</h3>
                  <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">{mat.desc}</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500 shadow-xl border border-white/10">
                  <ArrowUpRight size={24} className="text-white group-hover:rotate-45 transition-transform duration-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}