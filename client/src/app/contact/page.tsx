'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Clock, Activity, Globe } from 'lucide-react';
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
        alert("Message sent! We'll get back to you soon.");
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      }
    } catch (err: any) {
      alert(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
    tl.fromTo('.reveal-text', { opacity: 0, y: 100 }, { opacity: 1, y: 0, stagger: 0.1 })
      .fromTo('.reveal-side', { x: -100, opacity: 0 }, { x: 0, opacity: 1 }, '-=1')
      .fromTo('.reveal-up', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2 }, '-=0.5');

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

    gsap.to('.vertical-watermark', {
      yPercent: -50,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });
  }, { dependencies: [], scope: containerRef });

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-8">Get In Touch</h1>
            <p className="text-lg font-bold text-slate-500 max-w-sm mb-12">Whether you need custom design help or order status, our team is ready to assist you.</p>
            
            <div className="space-y-8">
               <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                     <Phone size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Support</p>
                     <p className="font-black text-slate-900 dark:text-white italic">{settings?.contactPhone || '+91 98765 43210'}</p>
                  </div>
               </div>
               <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/30">
                     <Mail size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Support</p>
                     <p className="font-black text-slate-900 dark:text-white italic">{settings?.contactEmail || 'support@printixlabels.com'}</p>
                  </div>
               </div>
               <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center">
                     <MapPin size={24} />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-black mb-4 group-hover:text-orange-500 transition-colors uppercase tracking-tighter">{spec.val}</div>
                  <p className="text-sm text-black/60 font-medium leading-relaxed">{spec.desc}</p>
                  <div className="mt-10 h-[2px] w-full bg-black/5 relative overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-orange-500 w-0 group-hover:w-full transition-all duration-700 ease-out" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- THE FORM (Overlap Design) --- */}
        <section className="py-16 md:py-32 px-6 bg-black relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Form Side */}
            <div className="col-span-12 lg:col-span-6 relative z-20 order-2 lg:order-1">
              <div className="bg-[#111111] p-12 lg:p-16 shadow-[60px_60px_0px_0px_#f97316] relative reveal-up border border-white/10 rounded-tr-[4rem] rounded-bl-[4rem]">
                
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                    <Activity size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-white">Submit Dossier</span>
                </div>
                
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.85] mb-12 italic">
                  PROJECT <br/> <span className="text-orange-500">SPECS.</span>
                </h2>

                <form onSubmit={handleSendMessage} className="space-y-10">
                  <div className="space-y-4 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-orange-500 transition-colors">Full Name</label>
                    <input 
                      required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      type="text" 
                      className="w-full bg-transparent border-b-2 border-white/10 pb-3 text-xl font-medium text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-white/20" 
                      placeholder="John Doe" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-orange-500 transition-colors">Email Address</label>
                      <input 
                        required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                        type="email" 
                        className="w-full bg-transparent border-b-2 border-white/10 pb-3 text-xl font-medium text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-white/20" 
                        placeholder="john@company.com" 
                      />
                    </div>
                    <div className="space-y-4 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-orange-500 transition-colors">Direct Line</label>
                      <input 
                        required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        type="tel" 
                        className="w-full bg-transparent border-b-2 border-white/10 pb-3 text-xl font-medium text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-white/20" 
                        placeholder="+1 (555) 000-0000" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 group-focus-within:text-orange-500 transition-colors">Message / Volume Details</label>
                    <textarea 
                      required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4} 
                      className="w-full bg-transparent border-b-2 border-white/10 pb-3 text-xl font-medium text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-white/20 resize-none leading-relaxed" 
                      placeholder="Tell us about the volume, material, and timeframe..." 
                    />
                  </div>

                  <button 
                    disabled={loading} type="submit" 
                    className="group mt-12 flex items-center justify-between w-full bg-white text-black hover:bg-orange-500 hover:text-white transition-colors px-10 py-6 font-black uppercase tracking-[0.3em] disabled:opacity-50"
                  >
                    <span>{loading ? 'Transmitting...' : 'Initialize Request'}</span>
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </form>

              </div>
            </div>

            {/* Overlap Image Side */}
            <div className="col-span-12 lg:col-span-6 lg:-ml-24 relative overflow-hidden h-[600px] lg:h-[900px] parallax-container order-1 lg:order-2">
              <div className="absolute inset-0 border-[20px] border-black z-20 pointer-events-none rounded-[4rem]" />
              <Image 
                src="/images/craftsmanship.png" 
                alt="Contact Process" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-[2s]"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-12 right-12 text-right z-30">
                <div className="text-[10rem] font-black text-white/10 leading-none outline-text">401</div>
              </div>
            </div>

          </div>
        </section>

        {/* --- MAP SECTION --- */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-24 reveal-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
               <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">Facility <br/><span className="text-orange-500 text-transparent" style={{ WebkitTextStroke: '1px #f97316' }}>Map.</span></h3>
               <div className="text-[10px] font-black uppercase tracking-[1em] text-black/40">COORD_41.8781_N_87.6298_W</div>
            </div>
            <div className="w-full h-[600px] overflow-hidden border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative group bg-[#111111] skew-y-[-2deg]">
              <div className="absolute inset-0 bg-orange-500 mix-blend-color pointer-events-none z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d190253.90566896263!2d-87.87223945828469!3d41.83390365731309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4cbed%3A0xafe0a6ad09c0c000!2sChicago%2C%20IL!5e0!3m2!1sen!2sus!4v1709149022646!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(100%) contrast(1.1) opacity(0.8)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="group-hover:filter-none transition-all duration-[2s] ease-in-out scale-110"
              ></iframe>
              <div className="absolute top-12 left-12 bg-white/90 backdrop-blur-md px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-2xl skew-y-[2deg] z-20">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block mr-4 animate-pulse" />
                Live Feed Active
              </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
