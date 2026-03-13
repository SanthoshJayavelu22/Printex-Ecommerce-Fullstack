"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchApi, getImageUrl } from '@/lib/api';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MainSlider() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetchApi('/banners');
        if (res.success && res.data.length > 0) {
          setBanners(res.data);
        }
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  useGSAP(() => {
    if (banners.length === 0) return;
    
    gsap.fromTo('.slide-content > *', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: 'power4.out' }
    );
    
    gsap.fromTo('.slide-bg',
      { scale: 1.2 },
      { scale: 1, duration: 4, ease: 'power2.out' }
    );
  }, { dependencies: [currentIndex, banners], scope: containerRef });

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  if (loading) return <div className="w-full h-[70vh] bg-slate-50 animate-pulse" />;
  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <section ref={containerRef} className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 slide-bg">
        <Image 
          src={getImageUrl(currentBanner.image)}
          alt={currentBanner.title}
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24 h-full relative z-20 flex items-center">
        <div className="max-w-3xl slide-content">
           <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
             {currentBanner.subtitle || 'Premium Quality Labels'}
           </span>
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-8">
             {currentBanner.title}
           </h1>
           <Link 
            href={currentBanner.link || '/shop'}
            className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105"
           >
             Shop Now <ArrowRight size={18} />
           </Link>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <div className="absolute bottom-12 left-6 md:left-24 z-30 flex items-center gap-4">
             {banners.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
                />
             ))}
          </div>
          
          <div className="absolute bottom-12 right-6 md:right-24 z-30 flex items-center gap-3">
             <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
              className="p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
             >
               <ChevronLeft size={20} />
             </button>
             <button 
               onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
               className="p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
             >
               <ChevronRight size={20} />
             </button>
          </div>
        </>
      )}
    </section>
  );
}
