'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Sparkles, Target, Zap, ShieldCheck, Users, Trophy, ArrowRight, Star, MousePointer2, Layers, Truck, Droplets, Leaf, Activity, Globe } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { step: "01", title: "Digital Mastery", desc: "Our pre-press team reviews every vector and pixel for perfect print readiness.", img: "/images/step_design.png", icon: <MousePointer2 size={24} /> },
    { step: "02", title: "Material Science", desc: "We select the substrate that survives your product's lifestyle—from freezers to oceans.", img: "/images/step_cutting.png", icon: <Layers size={24} /> },
    { step: "03", title: "Industrial Fusion", desc: "1200 DPI high-speed 8-color printing meets laser-accurate die cutting.", img: "/images/about_hero.png", icon: <Zap size={24} /> },
    { step: "04", title: "Final Dispatch", desc: "Vacuum-sealed, counted twice, and shipped via expedited logistics.", img: "/images/step_packing.png", icon: <Truck size={24} /> },
  ];

  const nextStep = () => {
    setActiveStep((prev) => {
      const maxVisible = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 2 : 1;
      if (prev < steps.length - maxVisible) return prev + 1;
      return prev;
    });
  };
  const prevStep = () => setActiveStep((prev) => (prev > 0 ? prev - 1 : 0));

  useGSAP(() => {
    // 1. Initial Reveals
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
    tl.fromTo('.reveal-text', { opacity: 0, y: 100 }, { opacity: 1, y: 0, stagger: 0.1 })
      .fromTo('.reveal-side', { x: -100, opacity: 0 }, { x: 0, opacity: 1 }, '-=1')
      .fromTo('.reveal-up', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2 }, '-=0.5');

    // 2. Vertical Scroller Watermark
    gsap.to('.vertical-watermark', {
      yPercent: -50,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    // 3. Removed Dynamic Backgrounds for Stability
    // (Sections now use static CSS classes for background colors)

    // 4. Parallax Images
    gsap.utils.toArray('.parallax-container').forEach((container: any) => {
      const img = container.querySelector('img');
      if (img) {
        gsap.to(img, {
          yPercent: 15,
          scale: 1.05,
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });

    // 5. Stat Counter Logic
    gsap.utils.toArray('.stat-number').forEach((stat: any) => {
      const target = parseInt(stat.getAttribute('data-target') || '0');
      gsap.fromTo(stat, { innerText: 0 }, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: stat,
          start: 'top 95%',
        }
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    const timer = setTimeout(refresh, 500);

    return () => clearTimeout(timer);
  }, { dependencies: [], scope: containerRef });

  // 6. Smooth Scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenis.off('scroll', onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#FAFAFA] overflow-x-hidden selection:bg-orange-500 selection:text-white">
      <Header />
      
      {/* PERSISTENT ELEMENTS */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-0 opacity-[0.03] select-none pointer-events-none hidden lg:block">
        <h1 className="vertical-watermark text-[30rem] font-black leading-none uppercase tracking-tighter" style={{ writingMode: 'vertical-rl' }}>
          PRINTEX
        </h1>
      </div>

      <main className="relative z-10">
        
        {/* --- UNIQUE ASYMMETRIC HERO --- */}
        <section data-bg-color="#FAFAFA" className="min-h-screen flex flex-col lg:flex-row items-stretch pt-20 pb-16 md:pb-24">
          <div className="lg:w-1/2 flex items-center px-6 lg:px-24 py-24 order-2 lg:order-1">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-8 reveal-side">
                <div className="h-[2px] w-20 bg-orange-500" />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-500">The Manifesto v1.0</span>
              </div>
              <h1 className="text-7xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase mb-12">
                <span className="reveal-text block">BEYOND</span>
                <span className="reveal-text block text-transparent" style={{ WebkitTextStroke: '2px black' }}>SURFACE.</span>
              </h1>
              <p className="text-2xl text-gray-400 font-medium leading-relaxed mb-16 reveal-up">
                We don't just print labels. We engineer identity for physical products that exist in a digital world.
              </p>
              <div className="flex items-center gap-12 reveal-up">
                <div className="group cursor-pointer">
                  <div className="text-5xl font-black mb-1 group-hover:text-orange-500 transition-colors">12Y</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Engineering Heritage</div>
                </div>
                <div className="h-12 w-[1px] bg-black/10" />
                <div className="group cursor-pointer">
                  <div className="text-5xl font-black mb-1 group-hover:text-orange-500 transition-colors">99%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Defect-Free Accuracy</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative min-h-[50vh] lg:min-h-screen order-1 lg:order-2">
            <div className="absolute inset-0 skew-x-[-6deg] translate-x-12 lg:translate-x-24 overflow-hidden shadow-2xl">
              <Image 
                src="/images/about_hero.png" 
                alt="Hero" 
                fill 
                className="object-cover scale-110" 
                priority
              />
              <div className="absolute inset-0 bg-orange-500/20 mix-blend-multiply" />
            </div>
          </div>
        </section>

        {/* --- THE "CORE" SECTION (Unique Overlap) --- */}
        <section data-bg-color="#FAFAFA" className="py-16 md:py-24 px-6 lg:px-24">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-5 relative z-20">
              <div className="bg-white p-12 lg:p-24 shadow-[60px_60px_0px_0px_#f97316] reveal-up">
                <h2 className="text-6xl font-black uppercase tracking-tighter mb-10 italic">OUR STORY IS <br/> WRITTEN IN <br/> <span className="text-orange-500">PRECISION.</span></h2>
                <div className="space-y-6 text-xl text-gray-500 font-medium leading-relaxed">
                  <p>In 2012, we noticed a gap in the market. Labels were treated as commodities, while they were actually the most critical point of contact between a brand and a consumer.</p>
                  <p className="text-black font-bold text-2xl">We decided to fix that.</p>
                  <p>By blending aeronautical precision with traditional craftsmanship, we created a manufacturing process that handles millions of units with zero deviation.</p>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:-ml-24 relative overflow-hidden h-[800px] parallax-container">
              <Image 
                src="/images/craftsmanship.png" 
                alt="Story" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20" />
              <div className="absolute top-12 right-12 text-right">
                <div className="text-[15rem] font-black text-white/10 leading-none">012</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TECHNICAL SPECS (Blueprints) --- */}
        <section data-bg-color="#FAFAFA" className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
            <div className="text-center mb-24 reveal-up">
              <h2 className="text-6xl md:text-9xl font-black text-black uppercase tracking-tighter mb-8 leading-none">THE <span className="text-transparent" style={{ WebkitTextStroke: '2px #f97316' }}>ANATOMY</span> OF STRETCH.</h2>
              <p className="text-black/60 font-black tracking-[0.5em] uppercase text-xs">Laboratory Certified Testing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "HEAT RESISTANCE", val: "240°F", desc: "No deformation under industrial heat." },
                { label: "UV STABILITY", val: "7-YR", desc: "Zero fade inks for outdoor longevity." },
                { label: "SHEAR STRENGTH", val: "48LBS", desc: "Permanent bond on high-surface energy." },
                { label: "COLOR ACCURACY", val: "∆E < 0.5", desc: "Spectrophotometer verified output." }
              ].map((spec, i) => (
                <div key={i} className="group p-10 bg-white border border-black/5 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-orange-500/20 transition-all duration-500 cursor-crosshair">
                  <div className="text-[10px] font-black text-black/60 mb-12 tracking-widest">{spec.label}</div>
                  <div className="text-5xl font-black text-black mb-4 group-hover:text-orange-500 transition-colors uppercase">{spec.val}</div>
                  <p className="text-sm text-black/60 font-medium leading-relaxed">{spec.desc}</p>
                  <div className="mt-10 h-[2px] w-full bg-black/5 relative overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-orange-500 w-0 group-hover:w-full transition-all duration-700 ease-out" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CULTURE OF FAILURE (Diagnostic Vault) --- */}
        <section data-bg-color="#FAFAFA" className="py-16 md:py-32 px-6 lg:px-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
              
              {/* Unique Viewfinder Image Container */}
              <div className="lg:w-3/5 relative reveal-up">
                 <div className="relative aspect-square md:aspect-video lg:aspect-square w-full rounded-[4rem] lg:rounded-full overflow-hidden border-[20px] border-white shadow-2xl parallax-container">
                    <Image 
                      src="/images/innovation_lab.png" 
                      alt="Lab" 
                      fill 
                      className="object-cover scale-125"
                    />
                    {/* Viewfinder Overlay */}
                    <div className="absolute inset-0 border-[2px] border-white/20 rounded-full m-8 pointer-events-none" />
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/20 pointer-events-none" />
                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/20 pointer-events-none" />
                 </div>

                 {/* Floating Diagnostic Callouts (Decorative) */}
                 <div className="absolute -top-8 -right-8 bg-white p-6 rounded-3xl shadow-xl hidden md:block border border-black/5 animate-bounce-slow">
                    <div className="text-[10px] font-black text-orange-500 mb-2 uppercase tracking-widest">Load Test #882</div>
                    <div className="text-xl font-bold text-black italic">OPTIMAL_GRID</div>
                 </div>
                 <div className="absolute -bottom-8 -left-8 bg-black text-white p-6 rounded-3xl shadow-xl hidden md:block animate-bounce-slow" style={{ animationDelay: '1s' }}>
                    <div className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Stress Sync</div>
                    <div className="text-xl font-bold italic">ZERO_FAIL</div>
                 </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-2/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                    <Activity size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-black">Technical Dossier</span>
                </div>
                
                <h2 className="text-7xl lg:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] mb-12">
                  CULTURE <br/> OF <span className="text-orange-500 italic">FAILURE.</span>
                </h2>
                
                <p className="text-2xl text-gray-500 font-medium leading-relaxed mb-16 italic">
                  "If we don't break our own records daily, we haven't engineered anything meaningful."
                </p>

                <div className="grid grid-cols-1 gap-10">
                  {[
                    { title: "Destructive Testing", desc: "Every adhesive batch is tested until total shear failure to find the absolute limit." },
                    { title: "Spectral Analysis", val: "∆E < 0.2", desc: "Chromatographic verification of ink stability across 5,000 continuous hours." }
                  ].map((item, i) => (
                    <div key={i} className="group cursor-default">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-black uppercase tracking-widest text-black group-hover:text-orange-500 transition-colors">{item.title}</h4>
                        {item.val && <span className="text-xs font-black text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">{item.val}</span>}
                      </div>
                      <p className="text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition-colors">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- PROFESSIONAL ENGINEERING FLOW --- */}
        <section data-bg-color="#000000" className="bg-black py-24 md:py-32 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32 reveal-up">
              <div className="max-w-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500">Six Sigma Optimized</span>
                </div>
                <h2 className="text-6xl md:text-[7rem] font-black uppercase tracking-tighter leading-none italic mb-8">
                  ENGINEERING <br/> FLOW<span className="text-orange-500">_</span>
                </h2>
              </div>
              <div className="lg:text-right">
                <p className="text-xl text-white/70 font-medium max-w-sm ml-auto leading-relaxed mb-8">
                  A high-fidelity manufacturing pipeline where every micron is accounted for, from initial vector to final dispatch.
                </p>
                <div className="inline-flex items-center gap-8 px-6 py-3 border border-white/20 rounded-full">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Stage 4: Active</span>
                  </div>
                  <div className="h-4 w-[1px] bg-white/20" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">v4.0.2</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Central Progress Spine */}
              <div className="absolute left-[30px] lg:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2 hidden md:block" />
              
              <div className="space-y-24">
                {steps.map((step, i) => (
                  <div key={i} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 reveal-up ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Visual Segment */}
                    <div className="w-full lg:w-1/2 relative group">
                      <div className="aspect-video relative overflow-hidden rounded-[2rem] border border-white/10">
                        <Image src={step.img} alt={step.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-700" />
                      </div>
                      {/* Floating Index */}
                      <div className="absolute -top-6 -left-6 w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl font-black italic shadow-2xl skew-x-[-10deg]">
                        {step.step}
                      </div>
                    </div>

                    {/* Content Segment */}
                    <div className="w-full lg:w-1/2 text-left">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                          {step.icon}
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tight">{step.title}</h3>
                      </div>
                      <p className="text-xl text-white/70 font-medium leading-relaxed mb-10 max-w-lg">
                        {step.desc}
                      </p>
                      <ul className="space-y-4">
                        {['Surgical Precision Check', 'Material Validation', 'Expedited Logistics'].slice(0, 3 - i % 2).map((li, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/40">
                            <ArrowRight size={14} className="text-orange-500" /> {li}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- COMPACT NETWORK PERFORMANCE --- */}
        <section data-bg-color="#FAFAFA" className="bg-[#FAFAFA] py-16 md:py-24 px-6 lg:px-24">
          <div className="max-w-7xl mx-auto border-t border-black/10 pt-16">
            <div className="flex flex-col lg:flex-row items-baseline justify-between gap-12 mb-20 reveal-up">
              <div className="flex items-center gap-6">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">GLOBAL VELOCITY.</h2>
              </div>
              <p className="text-sm text-black/60 font-bold uppercase tracking-widest max-w-sm">
                Optimized logistic nodes across 4 continents ensuring 48h turnaround for local and international precision dispatch.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/10 reveal-up">
              {[
                { label: "Active Markets", target: 42, suffix: "+" },
                { label: "Logistics Hubs", target: 6, suffix: "" },
                { label: "Daily Units", target: 15, suffix: "K" },
                { label: "Turnaround", target: 48, suffix: "H" }
              ].map((metric, i) => (
                <div key={i} className="px-10 first:pl-0 last:pr-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Globe size={14} className="text-orange-500" />
                    <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">{metric.label}</span>
                  </div>
                  <div className="text-7xl font-light text-black tracking-tighter">
                    <span className="stat-number font-black" data-target={metric.target}>0</span><span className="text-orange-500 font-black">{metric.suffix}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-20 flex items-center justify-between border-b border-black/10 pb-16 opacity-60">
               <div className="text-[10px] font-black uppercase tracking-[1em]">SYSTEM_STABLE</div>
               <div className="text-[10px] font-black uppercase tracking-[1em]">UTC_OFFSET_0.00</div>
            </div>
          </div>
        </section>

        {/* --- ELEGANT CTA --- */}
        <section data-bg-color="#FAFAFA" className="py-16 md:py-32 px-6 relative overflow-hidden">
          {/* Subtle Technical Accents */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
            <div className="absolute top-20 left-20 text-[10px] font-black uppercase tracking-[1em]" style={{ writingMode: 'vertical-rl' }}>COORD_40.7128_N</div>
            <div className="absolute bottom-20 right-20 text-[10px] font-black uppercase tracking-[1em]" style={{ writingMode: 'vertical-rl' }}>PRINTEX_OVR_9000</div>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-end justify-between gap-16 reveal-up">
            <div className="text-left">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-[1px] bg-black" />
                <span className="text-xs font-black uppercase tracking-[0.5em]">Call to Action</span>
              </div>
              <h2 className="text-7xl lg:text-[11rem] font-light uppercase tracking-tighter leading-[0.85] mb-8">
                LEAVE YOUR <br/> <span className="font-black italic text-orange-500">MARK.</span>
              </h2>
            </div>

            <div className="max-w-md text-left lg:text-right">
              <p className="text-xl text-gray-400 font-medium mb-12 leading-relaxed">
                Your brand's physical manifestation is its most powerful asset. We don't just print; we immortalize your vision on the highest quality substrates known to industry.
              </p>
              
              <div className="flex flex-col lg:items-end gap-12">
                <button className="group relative pr-32 py-6 text-xl font-black uppercase tracking-[0.4em] transition-all border-b-2 border-black hover:pr-40">
                  <span className="relative z-10 transition-transform group-hover:italic group-hover:text-orange-500">START PROJECT</span>
                  <ArrowRight size={32} className="absolute right-0 top-1/2 -translate-y-1/2 transition-all group-hover:right-[-10px] group-hover:text-orange-500" />
                </button>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 text-[10px] font-black uppercase tracking-widest text-black/30">
                  <div className="flex items-center lg:justify-end gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> 01. SURGICAL PRECISION
                  </div>
                  <div className="flex items-center lg:justify-end gap-3">
                    <span className="w-2 h-2 rounded-full bg-black/10" /> 02. INDUSTRIAL DURABILITY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
