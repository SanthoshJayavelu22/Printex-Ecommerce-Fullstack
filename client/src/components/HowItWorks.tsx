'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    title: 'Upload Your Design',
    desc: 'PNG, JPG, AI, PDF accepted'
  },
  {
    number: '02',
    title: 'Select Size & Quantity',
    desc: 'Choose from standard or custom'
  },
  {
    number: '03',
    title: 'Approve Digital Proof',
    desc: "We'll send a preview for approval"
  },
  {
    number: '04',
    title: 'We Print & Deliver',
    desc: 'Fast dispatch across India'
  }
]

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.hiw-header',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )

    gsap.fromTo('.hiw-step',
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.hiw-grid', start: 'top 85%' } }
    )
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gray-800 text-white relative overflow-hidden" ref={containerRef}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="hiw-header max-w-4xl mx-auto text-center mb-20 lg:mb-32">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-8 backdrop-blur-md">
            Simple Process
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter mb-8 leading-[0.85] text-balance">
            From Screen <br /> <span className="text-white/60">To Sticker.</span>
          </h2>
        </div>

        <div className="hiw-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
          {steps.map((step) => (
            <div key={step.number} className="hiw-step group relative text-center flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-[#111] border border-white/10 flex items-center justify-center mb-8 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-4 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                <span className="text-3xl sm:text-4xl font-black italic tracking-tighter">{step.number}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-gray-300 transition-colors duration-300">{step.title}</h3>
              <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px] leading-relaxed max-w-[200px] group-hover:text-white transition-colors duration-300">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}