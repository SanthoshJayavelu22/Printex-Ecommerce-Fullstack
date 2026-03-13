"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Search, Mail, Phone, Calendar, Trash2, CheckCircle2, MessageSquare, ExternalLink, ChevronRight, User } from "lucide-react";

export default function AdminContacts() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [filter, setFilter] = useState("all"); // all, unread, replied

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/contacts");
      setInquiries(res.data || []);
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryClick = async (inquiry: any) => {
    setSelectedInquiry(inquiry);
    if (!inquiry.isRead) {
      try {
        await fetchApi(`/contacts/${inquiry._id}`, { method: "GET" });
        loadInquiries();
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete this inquiry?`)) return;
    try {
      await fetchApi(`/contacts/${id}`, { method: "DELETE" });
      loadInquiries();
      if (selectedInquiry?._id === id) setSelectedInquiry(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete inquiry");
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = 
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "unread") return matchesSearch && !i.isRead;
    if (filter === "replied") return matchesSearch && i.isReplied;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Customer Inquiries</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Manage messages from the Contact Us form.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            All Incoming
          </button>
          <button 
            onClick={() => setFilter("unread")}
            className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'unread' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Unread {inquiries.filter(i => !i.isRead).length > 0 && `(${inquiries.filter(i => !i.isRead).length})`}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 min-h-[600px]">
        {/* Inbox List */}
        <div className="w-full xl:w-[450px] space-y-4">
           <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Find inquiry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
              />
           </div>

           <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] animate-pulse"></div>)
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                   <div 
                    key={inquiry._id} 
                    onClick={() => handleInquiryClick(inquiry)}
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all hover:-translate-y-1 relative group overflow-hidden ${
                      selectedInquiry?._id === inquiry._id 
                        ? 'bg-white dark:bg-slate-900 border-indigo-600 ring-4 ring-indigo-500/5 dark:ring-indigo-500/10' 
                        : inquiry.isRead 
                          ? 'bg-slate-50/50 dark:bg-slate-950/50 border-transparent hover:border-slate-100 dark:hover:border-slate-800' 
                          : 'bg-white dark:bg-slate-900 border-indigo-600 shadow-xl shadow-indigo-600/10'
                    }`}
                   >
                     {!inquiry.isRead && (
                       <div className="absolute top-6 right-6 h-2 w-2 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.8)]" />
                     )}
                     <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black ${inquiry.isRead ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-indigo-600 text-white'}`}>
                               {inquiry.name.charAt(0)}
                             </div>
                             <span className={`text-xs font-black uppercase tracking-widest ${inquiry.isRead ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>{inquiry.name}</span>
                           </div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                        <h3 className={`text-sm font-black tracking-tight line-clamp-1 ${inquiry.isRead ? 'text-slate-600' : 'text-slate-900 dark:text-white'}`}>{inquiry.subject}</h3>
                        <p className={`text-xs font-bold line-clamp-1 ${inquiry.isRead ? 'text-slate-400' : 'text-slate-500'}`}>{inquiry.message}</p>
                     </div>
                   </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No messages found.</div>
              )}
           </div>
        </div>

        {/* Message View */}
        <div className="flex-1">
           {selectedInquiry ? (
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 xl:p-14 shadow-sm min-h-[600px] flex flex-col animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-start justify-between mb-12 pb-12 border-b border-slate-50 dark:border-slate-800">
                   <div className="flex items-center gap-6">
                      <div className="h-20 w-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                         <User size={32} />
                      </div>
                      <div>
                         <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{selectedInquiry.name}</h2>
                         <div className="flex flex-wrap items-center gap-6 mt-3">
                            <a href={`mailto:${selectedInquiry.email}`} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                               <Mail size={14} /> {selectedInquiry.email}
                            </a>
                            <a href={`tel:${selectedInquiry.phone}`} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                               <Phone size={14} /> {selectedInquiry.phone}
                            </a>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                               <Calendar size={14} /> {new Date(selectedInquiry.createdAt).toLocaleString()}
                            </div>
                         </div>
                      </div>
                   </div>
                   <button 
                    onClick={(e) => handleDelete(e, selectedInquiry._id)}
                    className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>

                <div className="flex-1 mb-12">
                   <div className="mb-6">
                      <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest block mb-4">Subject Line</span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">{selectedInquiry.subject}</h3>
                   </div>
                   <div>
                      <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest block mb-4">Message Body</span>
                      <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 min-h-[200px]">
                         <p className="text-base font-bold text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-slate-50 dark:border-slate-800">
                   <div className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${selectedInquiry.isReplied ? 'bg-emerald-500' : 'bg-slate-200 animate-pulse'}`} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedInquiry.isReplied ? 'Response Sent' : 'Awaiting Reply'}</span>
                   </div>
                   <button 
                    onClick={() => window.location.href = `mailto:${selectedInquiry.email}?subject=RE: ${selectedInquiry.subject}`}
                    className="flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl hover:bg-indigo-600 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95"
                   >
                     Submit Response <ChevronRight size={16} />
                   </button>
                </div>
             </div>
           ) : (
             <div className="h-full bg-slate-50/50 dark:bg-slate-950/20 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center p-20 text-center text-slate-300">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm mb-8">
                   <MessageSquare size={48} className="text-slate-100 dark:text-slate-800" />
                </div>
                <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">Select correspondence</h2>
                <p className="text-xs font-bold uppercase tracking-widest">Awaiting your command, Admin.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
