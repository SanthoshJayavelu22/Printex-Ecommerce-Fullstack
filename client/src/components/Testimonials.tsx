'use client'

import { Star, Quote } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Startup Founder',
    content: 'Incredible print quality and super fast delivery. The die-cut stickers look perfect on our product packaging.',
    rating: 5,
  },
  {
    name: 'Priya Kapoor',
    role: 'Etsy Seller',
    content: 'The transparent stickers are exactly what I needed. They really pop on glass jars. Will order again!',
    rating: 5,
  },
  {
    name: 'Rohan Desai',
    role: 'Marketing Head',
    content: 'Bulk order pricing is very competitive. The team helped with the proof and we got 5000 labels in 3 days.',
    rating: 5,
  },
]

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.testi-header',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )

    gsap.fromTo('.testi-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out', scrollTrigger: { trigger: '.testi-grid', start: 'top 80%' } }
    )
  }, [])

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA]" ref={containerRef}>
      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative">
        <div className="testi-header flex flex-col md:flex-row items-end justify-between mb-24 gap-12 px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/5 bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-8 backdrop-blur-md">
              <Star size={14} className="text-black" />
              Trusted Globally
            </div>
            <h2 className="text-5xl md:text-[6rem] lg:text-[7.5rem] font-black text-black uppercase tracking-tighter mb-6 leading-[0.8] text-balance">
              Customer <br /> Reviews.
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
              Loved by 5000+ brands
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] cursor-default">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-green-500 flex items-center justify-center text-white text-xs font-bold rounded-sm shadow-sm">★</div>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Perfect Score on Trustpilot</p>
          </div>
        </div>

        <div className="testi-grid grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="testi-card group bg-white p-10 lg:p-12 rounded-[3.5rem] flex flex-col justify-between border border-transparent shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-gray-100 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] cursor-pointer">
              <div>
                <Quote size={48} className="text-black/5 mb-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700" />
                <p className="text-xl text-black font-semibold leading-relaxed mb-12">
                  "{t.content}"
                </p>
              </div>
              <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-black uppercase tracking-tight">{t.name}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">{t.role}</p>
                </div>
                <div className="flex gap-1">
                   {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} size={14} className="fill-black text-black" />
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}