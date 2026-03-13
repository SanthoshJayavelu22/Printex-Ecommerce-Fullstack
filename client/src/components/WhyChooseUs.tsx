'use client'

import { Box, Camera, Droplet, Zap, Lock, MapPin } from 'lucide-react'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: <Box size={32} />,
    title: 'No Minimum Order',
    desc: 'Print as few as 10 stickers for your specific custom requirements.'
  },
  {
    icon: <Camera size={32} />,
    title: 'High Resolution Printing',
    desc: 'Up to 1200 DPI resolution, vibrant colours and perfect gradients.'
  },
  {
    icon: <Droplet size={32} />,
    title: 'Waterproof & Durable',
    desc: 'Scratch resistant, fade proof materials designed for long life.'
  },
  {
    icon: <Zap size={32} />,
    title: 'Fast Turnaround',
    desc: 'Standard dispatch within 48 hours for most of our products.'
  },
  {
    icon: <Lock size={32} />,
    title: 'Secure Payment',
    desc: '100% SSL encrypted checkout keeping your data extremely safe.'
  },
  {
    icon: <MapPin size={32} />,
    title: 'PAN India Shipping',
    desc: 'We deliver everywhere across the country seamlessly.'
  }
]

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.wcu-header',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
    )

    gsap.fromTo('.wcu-feature',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.wcu-grid', start: 'top 80%' } }
    )
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden" ref={containerRef}>
      <div className="absolute -top-[300px] -left-[300px] w-[800px] h-[800px] bg-gradient-to-br from-gray-100/50 to-transparent rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="wcu-header flex flex-col md:flex-row justify-between items-end mb-24 lg:mb-32 gap-12 px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/5 bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-8 backdrop-blur-md">
              Industry Standard
            </div>
            <h2 className="text-5xl md:text-[6rem] lg:text-[7.5rem] font-black text-black uppercase tracking-tighter mb-8 leading-[0.8] text-balance">
              WHY CHOOSE <br /> <span className="text-gray-200">US.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
              Engineered for precision. Built for scale. We set the global standard 
              in digital substrate manufacturing and artistic finishing.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:scale-105 transition-transform duration-500 cursor-default">
            <div className="flex gap-1 mb-2">
               {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold shadow-md">★</div>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Industry Leader Since 2010</p>
          </div>
        </div>

        <div className="wcu-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 lg:gap-y-24 gap-x-12 lg:gap-x-16">
          {features.map((item, i) => (
            <div key={i} className="wcu-feature group flex flex-col items-start gap-8 transition-all duration-700 p-8 rounded-[2.5rem] hover:bg-[#FAFAFA] border border-transparent hover:border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)] cursor-default">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center text-black group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-500 ease-out">
                {item.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-black uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-500 text-lg leading-relaxed max-w-sm font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}