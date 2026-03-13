"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Minus, Search } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is your minimum order quantity (MOQ)?",
      a: "Our standard MOQ starts at 25 pieces for most custom stickers and labels. This allows small businesses to test branding without high initial costs."
    },
    {
      q: "How fast is your shipping?",
      a: "Most orders are dispatched within 2-3 business days after design approval. Express shipping typically takes another 3-5 days depending on your location."
    },
    {
      q: "Can I upload my own design?",
      a: "Absolutely! You can upload your artwork in PDF, AI, PSD, or high-resolution PNG/JPG formats. If you don't have a design, our professional team can assist you."
    },
    {
      q: "Are the labels waterproof?",
      a: "We offer both paper-based and film-based labels. Select our 'Thin Film' or 'Vinyl' options for full water and weather resistance."
    },
    {
      q: "Do you provide design proofs?",
      a: "Yes, we send a digital proof for every custom order via WhatsApp or Email. Production only begins after you give the final approval."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6 italic">Help Center</h1>
            <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">Everything you need to know about our process</p>
          </div>

          <div className="relative mb-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text" 
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-none rounded-[2rem] pl-16 pr-8 py-8 text-xl font-bold shadow-2xl focus:ring-2 focus:ring-primary transition-all outline-none"
            />
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full text-left px-8 py-8 flex items-center justify-between group"
                >
                  <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{faq.q}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-black text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200'}`}>
                    {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xl font-bold text-slate-400">No results found for "{searchTerm}"</p>
              </div>
            )}
          </div>

          <div className="mt-20 bg-black rounded-[3rem] p-12 text-center text-white">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Still have questions?</h2>
            <p className="text-slate-400 font-medium mb-8">Can't find the answer you're looking for? Please chat with our friendly team.</p>
            <a href="/contact" className="inline-block bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Get In Touch</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
