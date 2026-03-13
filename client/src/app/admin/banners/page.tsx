"use client";

import { useEffect, useState } from "react";
import { fetchApi, getImageUrl } from "@/lib/api";
import { Plus, Trash2, ImageIcon, Search, X, Edit, MoveVertical, ExternalLink } from "lucide-react";

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("/");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/banners/admin");
      setBanners(res.data || []);
    } catch (err) {
      console.error("Failed to load banners", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("link", link);
      formData.append("isActive", String(isActive));
      formData.append("order", String(order || 0));
      
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (!editingId) {
        alert("Please select an image for the new banner");
        return;
      }
      
      let endpoint = "/banners";
      let method = "POST";
      
      if (editingId) {
        endpoint = `/banners/${editingId}`;
        method = "PUT";
      }

      await fetchApi(endpoint, {
        method,
        body: formData
      });
      
      handleCancelForm();
      loadBanners();
    } catch (err: any) {
      alert(err.message || "Failed to save banner");
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setLink("/");
    setIsActive(true);
    setOrder("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEditClick = (banner: any) => {
    setEditingId(banner._id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || "");
    setLink(banner.link);
    setIsActive(banner.isActive);
    setOrder(banner.order || 0);
    setImagePreview(getImageUrl(banner.image));
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this banner?`)) return;
    try {
      await fetchApi(`/banners/${id}`, { method: "DELETE" });
      loadBanners();
    } catch (err: any) {
      alert(err.message || "Failed to delete banner");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Slider Management</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Configure homepage banners and promotional sliders.</p>
        </div>
        <button
          onClick={() => {
             if (showAddForm) handleCancelForm();
             else setShowAddForm(true);
          }}
          className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${
            showAddForm 
              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
          }`}
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? "Cancel" : "Add Banner"}
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-indigo-600 dark:bg-indigo-500 p-3 rounded-[1.25rem] shadow-lg shadow-indigo-600/20">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {editingId ? "Edit Banner" : "New Slide"}
              </h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Visual Asset Config</p>
            </div>
          </div>

          <form onSubmit={handleSaveBanner} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Main Heading</label>
                 <input 
                   required value={title} onChange={(e) => setTitle(e.target.value)} 
                   className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all font-bold" 
                   placeholder="e.g. Premium Die-Cut Stickers" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Sub-heading / Tagline</label>
                 <input 
                   value={subtitle} onChange={(e) => setSubtitle(e.target.value)} 
                   className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all font-bold" 
                   placeholder="e.g. Get 20% off on your first order" 
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Redirect Link</label>
                    <input 
                      value={link} onChange={(e) => setLink(e.target.value)} 
                      className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Priority</label>
                    <input 
                      type="number" value={order} onChange={(e) => setOrder(e.target.value === '' ? '' : Number(e.target.value))} 
                      className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all font-bold" 
                    />
                  </div>
               </div>
               <div className="flex items-center pt-2">
                 <label className="group flex items-center cursor-pointer select-none">
                   <div className="relative">
                     <input 
                       type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} 
                       className="sr-only peer" 
                     />
                     <div className="w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-indigo-600 transition-all duration-300" />
                     <div className="content-[''] absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6 shadow-sm" />
                   </div>
                   <span className="ml-4 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Visible on Site</span>
                 </label>
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Banner Image (Recommended 1920x600)</label>
              <div 
                onClick={() => document.getElementById('image-upload')?.click()}
                className="aspect-[16/6] rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all overflow-hidden relative group"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-black uppercase tracking-widest">
                       Change Asset
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-10 w-10 text-slate-300 mb-4" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Image Asset</span>
                  </>
                )}
              </div>
              <input 
                id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" 
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-4 mt-4 border-t border-slate-100 dark:border-slate-800 pt-10">
              <button 
                type="button" onClick={handleCancelForm} 
                className="px-8 py-4 text-xs font-black text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest border border-slate-100 dark:border-slate-800"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-10 py-4 text-xs font-black text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all uppercase tracking-widest active:scale-95"
              >
                {editingId ? "Update Asset" : "Deploy Slide"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
           [1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-900/50 rounded-[2.5rem] animate-pulse"></div>)
        ) : banners.length > 0 ? (
          banners.map((banner) => (
             <div key={banner._id} className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all">
                <div className="flex flex-col lg:flex-row">
                   <div className="lg:w-1/3 aspect-[21/9] lg:aspect-auto overflow-hidden bg-slate-100">
                      <img 
                        src={getImageUrl(banner.image)} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                        alt={banner.title} 
                      />
                   </div>
                   <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between gap-6">
                      <div className="space-y-2">
                         <div className="flex items-center gap-3 mb-2">
                           <span className="text-[9px] font-black uppercase bg-indigo-600 text-white px-3 py-1 rounded-full tracking-widest">Priority {banner.order}</span>
                           <div className={`h-2 w-2 rounded-full ${banner.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                           <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{banner.isActive ? 'Live' : 'Hidden'}</span>
                         </div>
                         <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{banner.title}</h2>
                         <p className="text-sm font-bold text-slate-500 dark:text-slate-400 capitalize">{banner.subtitle}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-6">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                           <ExternalLink size={12} /> {banner.link}
                         </div>
                         <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleEditClick(banner)}
                              className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-black dark:hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(banner._id)}
                              className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="absolute top-8 left-8 p-3 bg-white/60 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                   <MoveVertical size={16} className="text-slate-900" />
                </div>
             </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] p-32 text-center text-slate-400 font-bold uppercase tracking-widest">
            No active sliders found. Define your visual hierarchy.
          </div>
        )}
      </div>
    </div>
  );
}
