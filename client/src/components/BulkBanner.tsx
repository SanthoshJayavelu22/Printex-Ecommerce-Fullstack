'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BulkBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    })

    tl.fromTo('.banner-box', 
      { opacity: 0, scale: 0.95, rotateX: 10 },
      { opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: 'power4.out' }
    )
    .fromTo('.banner-content > *',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)' },
      '-=1'
    )
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white perspective-1000" ref={containerRef}>
      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24">
        <div className="banner-box relative bg-[#0a0a0a] rounded-[3rem] lg:rounded-[4rem] p-12 md:p-32 overflow-hidden group min-h-[500px] flex items-center justify-center border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.15)]">
          
          {/* Cinematic Background */}
          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 group-hover:scale-105 transform ease-out">
            <Image
              src="/images/bulk_banner.png"
              alt="Industrial Printing Operation"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="banner-content relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/10 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.3em] text-white/80 mb-10 shadow-lg cursor-default hover:bg-white/20 transition-colors duration-500">
              <Sparkles size={14} className="text-white" />
              Volume Discount
            </div>
            
            <h2 className="text-5xl md:text-[6.5rem] lg:text-[8rem] font-black text-white uppercase tracking-tighter mb-8 leading-[0.8] text-balance drop-shadow-2xl">
              Need Bulk <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Printing?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 font-medium mb-14 max-w-2xl leading-relaxed">
              Get an instant quotation for enterprise packaging and bulk commercial label requirements.
            </p>
            
            <Link
              href="/bulk-quote"
              className="group/btn flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] duration-300"
            >
              <span>Instant Bulk Quote</span>
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-colors duration-500">
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-500" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}