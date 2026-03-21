'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Instagram, ArrowUpRight } from 'lucide-react'

const instaImages = [
  '/images/custom_stickers.png',
  '/images/barcode_labels.png',
  '/images/business_cards.png',
  '/images/packaging_sleeves.png',
  '/images/flyers.png',
  '/images/materials.png',
]

export default function InstagramShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.showcase-header',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )

    gsap.fromTo('.insta-item',
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.insta-grid', start: 'top 85%' } }
    )
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden" ref={containerRef}>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-gray-100/50 to-transparent rounded-full blur-[100px] -z-10 -translate-y-1/2" />

      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="showcase-header flex flex-col md:flex-row justify-between items-end mb-20 gap-12 px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/5 bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-8 backdrop-blur-md">
              <Instagram size={14} className="text-black" />
              Community
            </div>
            <h2 className="text-5xl md:text-[6rem] font-black text-black uppercase tracking-tighter mb-6 leading-[0.85] text-balance">
              The <br /> <span className="text-gray-200">Showcase.</span>
            </h2>
            <p className="text-xl text-gray-400 font-medium">Join 10k+ brands sharing their identity. Tag #PrintixLabels</p>
          </div>
          <button className="group flex items-center gap-4 px-10 py-5 rounded-full bg-black text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex-nowrap whitespace-nowrap">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
              <Instagram size={16} /> 
            </div>
            View Studio
          </button>
        </div>

        <div className="insta-grid grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {instaImages.map((src, i) => (
            <div key={i} className="insta-item group aspect-square relative bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
              <Image
                src={src}
                alt={`Customer product ${i + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center border border-white/10 rounded-[2.5rem]">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-xl border border-white/20">
                  <ArrowUpRight size={24} className="text-white group-hover:rotate-45 transition-transform duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}