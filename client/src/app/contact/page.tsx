'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Activity, Globe, Send, MessageSquare } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { fetchApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchApi('/contacts', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.success) {
        alert("Transmission Received. Our team will contact you shortly.");
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      }
    } catch (err: any) {
      alert(err.message || "Uplink Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
    
    tl.fromTo('.hero-title', { opacity: 0, y: 100 }, { opacity: 1, y: 0 })
      .fromTo('.hero-subtitle', { opacity: 0, x: -30 }, { opacity: 1, x: 0 }, '-=1')
      .fromTo('.info-card', { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, stagger: 0.2 }, '-=1');

    gsap.fromTo('.form-container', 
      { opacity: 0, y: 50 }, 
      { 
        opacity: 1, y: 0, 
        scrollTrigger: {
          trigger: '.form-container',
          start: 'top 80%',
        }
      }
    );
  }, { scope: containerRef });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="bg-white dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      <Header />
      
      <main className="pt-32 md:pt-40 pb-16">
        
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 py-24 md:py-32 mb-20 overflow-hidden rounded-[2rem] max-w-7xl mx-auto mx-6">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
             <Image 
                src="/hero_printing.png" 
                alt="Production Facility" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-[3s]"
                priority
             />
             <div className="absolute inset-0 bg-slate-950/80 dark:bg-black/90 backdrop-blur-[2px]" />
             <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-indigo-500/5" />
          </div>

          <div className="relative z-10">
             <div className="absolute -top-10 -left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
             <div className="relative z-10">
                <span className="hero-subtitle text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-4 block">Communication Hub</span>
                <h1 className="hero-title text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] italic mb-8 text-white">
                   LET'S <br/>
                   <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white' }}>CHALLENGE</span> <br/>
                   CONVENTIONS.
                </h1>
                <p className="max-w-lg text-base font-bold text-slate-400 mb-12 leading-relaxed">
                   High-precision manufacturing meets avant-garde design. Our team is ready to scale your identity into the physical realm.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Phone Card */}
             <div className="info-card group bg-slate-50 dark:bg-[#111] p-8 border border-slate-200 dark:border-white/5 rounded-3xl hover:bg-black dark:hover:bg-orange-500 hover:text-white transition-all duration-500">
                <div className="w-12 h-12 bg-orange-500 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-6 transition-colors">
                   <Phone size={24} className="text-white" />
                </div>
                <h3 className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Direct Line</h3>
                <p className="text-xl font-black italic">{settings?.contactPhone || '+91 98765 43210'}</p>
             </div>

             {/* Email Card */}
             <div className="info-card group bg-slate-50 dark:bg-[#111] p-8 border border-slate-200 dark:border-white/5 rounded-3xl hover:bg-black dark:hover:bg-orange-500 hover:text-white transition-all duration-500">
                <div className="w-12 h-12 bg-indigo-600 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-6 transition-colors">
                   <Mail size={24} className="text-white" />
                </div>
                <h3 className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Data Request</h3>
                <p className="text-xl font-black italic truncate">{settings?.contactEmail || 'studio@printix.com'}</p>
             </div>

             {/* Location Card */}
             <div className="info-card group bg-slate-50 dark:bg-[#111] p-8 border border-slate-200 dark:border-white/5 rounded-3xl hover:bg-black dark:hover:bg-orange-500 hover:text-white transition-all duration-500">
                <div className="w-12 h-12 bg-black dark:bg-[#222] group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-6 transition-colors">
                   <MapPin size={24} className="text-white" />
                </div>
                <h3 className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Headquarters</h3>
                <p className="text-lg font-black italic leading-tight">{settings?.address || '123 Printing Way, Tech City'}</p>
             </div>
          </div>
        </section>

        {/* --- FORM SECTION --- */}
        <section className="bg-black py-20 md:py-24 px-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
           <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
           
           <div className="max-w-6xl mx-auto grid grid-cols-12 relative z-10">
              <div className="col-span-12 lg:col-span-10 lg:offset-1 form-container">
                 <div className="bg-[#0c0c0c] border border-white/10 p-8 md:p-16 rounded-[3rem] relative shadow-2xl">
                    <div className="flex items-center gap-4 mb-10">
                       <span className="w-8 h-[1px] bg-orange-500" />
                       <span className="text-[9px] font-black tracking-[0.5em] text-orange-500 uppercase">Initialize Mission</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-12 leading-none">
                       START THE <br/> <span className="text-transparent" style={{ WebkitTextStroke: '1px #f97316' }}>PROCESS.</span>
                    </h2>

                    <form onSubmit={handleSendMessage} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Full Name</label>
                          <input 
                             required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                             className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-bold text-white focus:outline-none focus:border-orange-500 transition-colors uppercase placeholder:text-white/5" 
                             placeholder="IDENTIFY YOURSELF"
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Email Protocol</label>
                          <input 
                             required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                             className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-bold text-white focus:outline-none focus:border-orange-500 transition-colors uppercase placeholder:text-white/5" 
                             placeholder="USER@DOMAIN.COM"
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Direct Line</label>
                          <input 
                             required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                             className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-bold text-white focus:outline-none focus:border-orange-500 transition-colors uppercase placeholder:text-white/5" 
                             placeholder="+XX XXX XXX XXXX"
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Subject Matter</label>
                          <input 
                             value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                             className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-bold text-white focus:outline-none focus:border-orange-500 transition-colors uppercase placeholder:text-white/5" 
                             placeholder="GENERAL INQUIRY"
                          />
                       </div>

                       <div className="col-span-full space-y-3 pt-4">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Briefing / Volume / Specs</label>
                          <textarea 
                             required rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                             className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-bold text-white focus:outline-none focus:border-orange-500 transition-colors uppercase resize-none placeholder:text-white/5" 
                             placeholder="STATE YOUR PROJECT REQUIREMENTS..."
                          />
                       </div>

                       <div className="col-span-full pt-10">
                          <button 
                             disabled={loading}
                             type="submit"
                             className="w-full bg-orange-500 text-white p-6 md:p-8 font-black text-xl uppercase italic flex items-center justify-between hover:bg-white hover:text-black transition-all duration-500 group"
                          >
                             <span>{loading ? 'TRANSMITTING...' : 'INTITIALIZE REQUEST'}</span>
                             <Send size={24} className="group-hover:translate-x-3 transition-transform duration-500" />
                          </button>
                       </div>
                    </form>
                 </div>
              </div>
           </div>
        </section>

        {/* --- MAP SECTION --- */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16">
              <div>
                 <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.8em] block mb-4">Strategic Location</span>
                 <h2 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter italic">PHYSICAL <br/> FOOTPRINT.</h2>
              </div>
              <div className="text-[9px] font-mono text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-[#111] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner w-fit">
                 COORD_41.8781_N_87.6298_W_ACTIVE_FEED
              </div>
           </div>
           
           <div className="w-full h-[500px] overflow-hidden rounded-[3rem] border border-black/5 dark:border-white/10 relative group bg-[#0c0c0c] grayscale hover:grayscale-0 transition-all duration-1000">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d190253.90566896263!2d-87.87223945828469!3d41.83390365731309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4cbed%3A0xafe0a6ad09c0c000!2sChicago%2C%20IL!5e0!3m2!1sen!2sus!4v1709149022646!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
              />
              <div className="absolute top-12 left-12 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-20">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block mr-4 animate-pulse" />
                Live Uplink Established
              </div>
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
