'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useEffect } from 'react'
import { ArrowRight, Sparkles, ShieldCheck, Zap, Globe, Star, CheckCircle } from 'lucide-react'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const floatingStickersRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } })
    
    // Staggered text reveal with a slight rotation for dynamic feel
    tl.fromTo('.reveal-text', 
      { opacity: 0, y: 120, rotate: 5, transformOrigin: '0% 100%' }, 
      { opacity: 1, y: 0, rotate: 0, stagger: 0.15 }
    )
    .fromTo(subRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0 }, 
      '-=1.2'
    )
    .fromTo(buttonsRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0 }, 
      '-=1'
    )
    .fromTo(imageContainerRef.current,
      { opacity: 0, x: 100, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 2, ease: 'elastic.out(1, 0.7)' },
      '-=1.5'
    )
    .fromTo('.floating-badge',
      { opacity: 0, scale: 0, rotate: -45 },
      { opacity: 1, scale: 1, rotate: 0, ease: 'back.out(1.7)', duration: 1 },
      '-=1'
    )
    .fromTo('.stat-item', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, stagger: 0.1 }, 
      '-=1.5'
    )

    // Continuous floating animation for background elements
    gsap.to('.float-element', {
      y: 'random(-20, 20)',
      x: 'random(-20, 20)',
      rotation: 'random(-15, 15)',
      duration: 'random(3, 5)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2
    })
  }, { scope: containerRef })

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      // Calculate distance from center (-1 to 1)
      const moveX = (clientX - centerX) / centerX
      const moveY = (clientY - centerY) / centerY

      gsap.to('.parallax-bg', {
        x: moveX * -30,
        y: moveY * -30,
        ease: 'power2.out',
        duration: 1
      })
      
      gsap.to('.parallax-fg', {
        x: moveX * 40,
        y: moveY * 40,
        rotateY: moveX * 10,
        rotateX: -moveY * 10,
        ease: 'power3.out',
        duration: 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section ref={containerRef} className="relative w-full flex items-center justify-center overflow-hidden bg-[#FAFAFA] pt-32 md:pt-40 pb-12 perspective-1000">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-red-100/40 to-orange-100/20 rounded-full blur-3xl opacity-70 parallax-bg" />
      <div className="absolute -bottom-40 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 to-purple-100/20 rounded-full blur-3xl opacity-70 parallax-bg" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000000 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left z-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/10 bg-white/80 backdrop-blur-md shadow-lg text-[10px] font-black uppercase tracking-[0.2em] text-black/60 mb-8 hover:bg-black hover:text-white transition-all duration-300 cursor-default parallax-fg">
              <Sparkles size={14} className="text-current" />
              Upload Design | Select Size | Choose Qty
            </div>
            
            <h1 ref={titleRef} className="text-6xl md:text-[7rem] xl:text-[8.5rem] font-black text-black mb-6 leading-[0.8] tracking-tighter uppercase relative">
              <div className="overflow-hidden pb-4"><div className="reveal-text">CUSTOM</div></div>
              <div className="overflow-hidden pb-4 relative">
                <div className="reveal-text flex items-center justify-center lg:justify-start gap-4">
                  STICKERS
                  {/* Decorative circle in title */}
                  <span className="hidden md:flex w-24 h-24 rounded-full border-8 border-black items-center justify-center">
                    <ArrowRight size={40} className="-rotate-45" />
                  </span>
                </div>
              </div>
              <div className="overflow-hidden pb-2"><div className="reveal-text text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500">& LABELS.</div></div>
            </h1>
            
            <p ref={subRef} className="text-xl md:text-2xl text-gray-500 mb-12 max-w-xl lg:mx-0 mx-auto leading-relaxed font-medium">
              Premium custom stickers and labels printing online. 
              <span className="text-black font-bold"> Upload your design</span> and experience industrial precision with fast turnaround.
            </p>
            
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
              <Link
                href="/shop"
                className="group relative bg-secondary text-white h-16 px-10 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 hover:shadow-[0_20px_40px_rgba(243,119,33,0.3)] transition-all duration-300"
              >
                <span>Start Printing</span>
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-secondary transition-colors">
                  <ArrowRight size={16} />
                </span>
              </Link>
              <Link
                href="/products"
                className="group h-16 px-10 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-3 text-black border-2 border-black/10 hover:border-black hover:bg-black/5 transition-all duration-300"
              >
                <div className="flex -space-x-3 group-hover:space-x-1 transition-all">
                  <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white z-20" />
                  <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white z-10" />
                  <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white z-0" />
                </div>
                Explore Products
              </Link>
            </div>
          </div>

          {/* Right Image/Composition */}
          <div className="flex-1 relative w-full max-w-2xl lg:h-[800px] flex items-center justify-center">
            
            {/* Abstract Decorative Elements */}
            <div ref={floatingStickersRef} className="absolute inset-0 pointer-events-none z-30 hidden md:block">
              <div className="float-element absolute top-10 left-10 w-24 h-24 bg-gradient-to-tr from-yellow-300 to-orange-400 rounded-full shadow-2xl flex items-center justify-center rotate-12">
                <span className="font-black text-white text-xs uppercase tracking-widest rotate-[-12deg]">Sale</span>
              </div>
              <div className="float-element absolute bottom-20 right-10 w-32 h-32 bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center -rotate-12 backdrop-blur-md">
                <Image src="/images/custom_stickers.png" alt="Sticker" width={60} height={60} className="rounded-xl mix-blend-multiply" />
              </div>
            </div>

            <div ref={imageContainerRef} className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[700px] parallax-fg perspective-1000">
              {/* Main Image Base */}
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] bg-gray-200 border-8 border-white">
                <Image
                  src="/images/hero_bg.png"
                  alt="Premium label printing"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  priority
                />
              </div>
              
              {/* Floating Interaction Cards */}
              <div className="floating-badge absolute top-12 -right-12 bg-white p-4 rounded-2xl shadow-2xl border border-black/5 hidden md:flex items-center gap-4 z-20 hover:scale-105 transition-transform cursor-default">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trustpilot</p>
                  <p className="text-sm font-bold text-black uppercase">4.9/5 Rating</p>
                </div>
              </div>

              <div className="floating-badge absolute -bottom-10 -left-10 glass p-6 rounded-[2rem] border border-white/40 shadow-2xl z-20 backdrop-blur-xl group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="w-16 h-16 animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                      <path id="textPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                      <text className="text-[11px] font-black uppercase tracking-[0.2em] fill-black">
                        <textPath href="#textPath" startOffset="0%">100% QUALITY GUARANTEED • </textPath>
                      </text>
                    </svg>
                    <ShieldCheck size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black" />
                  </div>
                  <div className="hidden sm:block">
                    <h4 className="text-lg font-black uppercase tracking-tight text-black">Precision <br/> Crafted.</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stats/Features Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 md:mt-16 relative z-20">
          {[
            { icon: <Zap size={24} />, label: 'FAST DISPATCH', sub: '48H TURNAROUND', color: 'bg-secondary/10 text-secondary' },
            { icon: <ShieldCheck size={24} />, label: 'PREMIUM VINYL', sub: 'UV PROTECTED', color: 'bg-primary/10 text-primary' },
            { icon: <Globe size={24} />, label: 'PAN INDIA SHIPPING', sub: 'FAST DELIVERY', color: 'bg-secondary/10 text-secondary' },
            { icon: <CheckCircle size={24} />, label: '1200 DPI PRINT', sub: 'HIGH RESOLUTION', color: 'bg-primary/10 text-primary' },
          ].map((feat, i) => (
            <div key={i} className="stat-item group bg-white hover:bg-black p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-start gap-6 cursor-default">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-white/10 group-hover:text-white transition-colors duration-500 ${feat.color}`}>
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-black group-hover:text-white text-lg tracking-widest uppercase transition-colors duration-500">{feat.label}</h3>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 font-bold uppercase tracking-widest leading-none transition-colors duration-500">{feat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}