'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, ArrowUp } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { fetchApi } from '@/lib/api'

export default function Footer() {
  const { settings } = useSettings()
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const socialIcons = [
    { Icon: Instagram, link: settings?.socialLinks?.instagram },
    { Icon: Facebook, link: settings?.socialLinks?.facebook },
    { Icon: Twitter, link: settings?.socialLinks?.twitter }
  ]

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetchApi('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      if (res.success) {
        alert(res.message);
        setEmail('');
      }
    } catch (err: any) {
      alert(err.message || 'Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-primary text-white pt-16 pb-12 overflow-hidden">
      <div className="max-w-9xl mx-auto px-6 md:px-12 xl:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link href="/" className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">
              {settings?.storeName || 'Printix'}<span className="text-white/50">.</span>
            </Link>
            <p className="text-white/70 font-medium leading-relaxed max-w-xs">
              {settings?.seo?.metaDescription || 'Crafting premium digital identities through precision label manufacturing and high-impact printing solutions.'}
            </p>
            <div className="flex gap-4">
              {socialIcons.map(({ Icon, link }, i) => (
                <Link key={i} href={link || '#'} target="_blank" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-500">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-8">Solutions</h4>
            <ul className="space-y-4">
              {['Custom Stickers', 'Barcode Labels', 'Packaging Sleeves', 'Business Cards', 'Flyers'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-8">Resources</h4>
            <ul className="space-y-4">
              {[
                { n: 'Help Center', l: '/faq' },
                { n: 'Shipping & Refunds', l: '/shipping-refund' },
                { n: 'Privacy Policy', l: '/privacy-policy' },
                { n: 'Terms of Service', l: '/terms' },
                { n: 'Contact Us', l: '/contact' }
              ].map((item) => (
                <li key={item.n}>
                  <Link href={item.l} className="text-white/70 hover:text-white transition-colors font-medium">
                    {item.n}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-8">Intelligence</h4>
            <form onSubmit={handleSubscribe} className="relative group">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Subscribe to insights" 
                className="w-full bg-transparent border-b border-white/20 pb-4 text-sm focus:border-white focus:outline-none transition-all placeholder:text-white/40"
              />
              <button 
                type="submit"
                disabled={submitting}
                className="absolute right-0 bottom-4 text-white group-hover:translate-x-2 transition-transform disabled:opacity-50"
              >
                {submitting ? '...' : '→'}
              </button>
            </form>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
              By subscribing, you agree to our Digital Terms & Privacy Policy.
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em]">
            {settings?.footerText || `© ${new Date().getFullYear()} PRINTIX LABELS. ALL RIGHTS RESERVED.`}
          </p>
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-4 text-white/50 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest"
          >
            Back to top <ArrowUp size={16} className="group-hover:-translate-y-2 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  )
}