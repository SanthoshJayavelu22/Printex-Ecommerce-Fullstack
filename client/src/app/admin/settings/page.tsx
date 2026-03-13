"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Settings, Save, Mail, Phone, MapPin, Globe, Share2, Search, ImageIcon, Layout, Type } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // general, social, seo

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/settings");
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchApi("/settings", {
        method: "PUT",
        body: JSON.stringify(settings)
      });
      alert("Settings updated successfully!");
    } catch (err: any) {
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any, nested?: string) => {
    if (nested) {
      setSettings((prev: any) => ({
        ...prev,
        [nested]: { ...prev[nested], [field]: value }
      }));
    } else {
      setSettings((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  if (loading) return (
     <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] w-1/3 mb-12" />
        <div className="h-[600px] bg-slate-50 dark:bg-slate-950/20 rounded-[3rem] border border-slate-100 dark:border-slate-800" />
     </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Global Settings</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Configure your store's identity and metadata.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-3">
           {[
             { id: "general", label: "General", icon: Layout },
             { id: "social", label: "Connects", icon: Share2 },
             { id: "seo", label: "Metadata", icon: Search }
           ].map(tab => (
             <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full p-5 rounded-3xl border-2 flex items-center gap-4 transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 shadow-xl shadow-indigo-600/10 dark:shadow-indigo-500/10' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
             >
               <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-colors ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                 <tab.icon size={20} />
               </div>
               <span className={`text-xs font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-slate-900 dark:text-white' : ''}`}>{tab.label}</span>
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 lg:p-14 shadow-sm relative overflow-hidden">
           {/* Visual background element */}
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-50" />
           
           <form onSubmit={handleUpdate} className="relative z-10 space-y-12">
              {activeTab === 'general' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Store Name</label>
                        <input className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white transition-all outline-none focus:ring-4 focus:ring-indigo-500/5" 
                           value={settings.storeName} onChange={(e) => handleChange('storeName', e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Email</label>
                        <div className="relative">
                           <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                           <input className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white transition-all outline-none focus:ring-4 focus:ring-indigo-500/5" 
                              value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} 
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Contact Phone</label>
                        <div className="relative">
                           <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                           <input className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white transition-all outline-none focus:ring-4 focus:ring-indigo-500/5" 
                              value={settings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} 
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Store Address</label>
                        <div className="relative">
                           <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                           <input className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white transition-all outline-none focus:ring-4 focus:ring-indigo-500/5" 
                              value={settings.address} onChange={(e) => handleChange('address', e.target.value)} 
                           />
                        </div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Footer Copyright Text</label>
                      <input className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white transition-all outline-none focus:ring-4 focus:ring-indigo-500/5" 
                         value={settings.footerText} onChange={(e) => handleChange('footerText', e.target.value)} 
                      />
                   </div>
                   <div className="space-y-10">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Visual Brand Identity</label>
                      <div className="flex flex-col sm:flex-row items-center gap-12 bg-slate-50 dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                         <div className="h-32 w-32 bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 rounded-[2.5rem] shadow-xl flex items-center justify-center p-4 relative group">
                            <img src={settings.logo} className="w-full h-auto object-contain" alt="Logo" />
                            <div className="absolute inset-0 bg-indigo-600/80 rounded-[2.25rem] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-black uppercase tracking-widest">
                               Change
                            </div>
                         </div>
                         <div className="flex-1 space-y-4">
                            <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">System Logo & Icon</p>
                            <p className="text-xs text-slate-400 font-medium">Recommended size 512x512px SVG or transparent PNG.</p>
                            <div className="flex gap-4">
                               <button type="button" className="px-6 py-2.5 text-[10px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-xl font-black uppercase tracking-widest shadow-sm">Replace Assets</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4">
                   {['facebook', 'instagram', 'twitter', 'linkedin'].map(net => (
                     <div key={net} className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1 capitalize">{net}</label>
                        <div className="relative">
                           <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                           <input className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white transition-all outline-none focus:ring-4" 
                              value={settings.socialLinks[net]} onChange={(e) => handleChange(net, e.target.value, 'socialLinks')} 
                           />
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Meta Page Title</label>
                      <input className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white focus:ring-4 outline-none transition-all" 
                         value={settings.seo.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value, 'seo')} 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Meta Keywords</label>
                      <input className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white focus:ring-4 outline-none transition-all" 
                         value={settings.seo.metaKeywords} onChange={(e) => handleChange('metaKeywords', e.target.value, 'seo')} 
                         placeholder="comma separated"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Meta Description</label>
                      <textarea className="block w-full h-32 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-6 px-6 text-sm font-bold text-slate-900 dark:text-white focus:bg-white focus:ring-4 outline-none transition-all resize-none" 
                         value={settings.seo.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value, 'seo')} 
                      />
                   </div>
                </div>
              )}

              <div className="pt-10 flex justify-end">
                 <button 
                  type="submit" disabled={saving}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                 >
                   <div className="flex items-center gap-3">
                      {saving ? 'Syncing...' : 'Save Configuration'}
                      <Save size={16} />
                   </div>
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
