"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { fetchApi } from '@/lib/api';

export default function ContactPage() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
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
                     <p className="font-black text-slate-900 dark:text-white italic">{settings?.contactEmail || 'support@printexlabels.com'}</p>
                  </div>
               </div>
               <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center">
                     <MapPin size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headquarters</p>
                     <p className="font-black text-slate-500 italic max-w-xs">{settings?.address || 'Label City, Printing District, Main Road HUB-401'}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 border border-slate-200 dark:border-slate-800 shadow-3xl">
             <h2 className="text-xl font-black uppercase tracking-tighter italic mb-8">Send Message</h2>
             <form onSubmit={handleSendMessage} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                   <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold placeholder:text-slate-300" placeholder="Your Name" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                        required type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold placeholder:text-slate-300" placeholder="name@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone No</label>
                    <input 
                        required type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold placeholder:text-slate-300" placeholder="Your mobile" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Message</label>
                   <textarea 
                    required rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 font-bold placeholder:text-slate-300" placeholder="How can we help?">
                   </textarea>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-black hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] px-8 py-5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
                >
                   {loading ? 'Transmitting...' : <><Send size={16} /> Send Message</>}
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}
