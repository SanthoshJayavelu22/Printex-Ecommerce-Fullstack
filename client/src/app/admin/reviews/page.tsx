"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Star, Trash2, CheckCircle2, XCircle, Search, MessageSquare, Package, User } from "lucide-react";
import { useAlertModal } from "@/contexts/ModalContext";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved
  const { showAlert, showConfirm } = useAlertModal();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/reviews");
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetchApi(`/reviews/${id}`, { 
        method: "PUT", 
        body: JSON.stringify({ isApproved: !currentStatus }) 
      });
      loadReviews();
    } catch (err: any) {
      showAlert("Update Error", err.message || "Failed to update review status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      "Delete Review",
      "Are you sure you want to delete this review? This action cannot be undone.",
      async () => {
        try {
          await fetchApi(`/reviews/${id}`, { method: "DELETE" });
          loadReviews();
          showAlert("Deleted", "Review has been removed.", "success");
        } catch (err: any) {
          showAlert("Delete Error", err.message || "Failed to delete review", "error");
        }
      },
      undefined,
      "alert"
    );
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
        r.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "pending") return matchesSearch && !r.isApproved;
    if (filter === "approved") return matchesSearch && r.isApproved;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Review Moderation</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Approve or delete customer reviews for your products.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setFilter("all")}
            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            All Logs
          </button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'pending' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Pending {reviews.filter(r => !r.isApproved).length > 0 && `(${reviews.filter(r => !r.isApproved).length})`}
          </button>
          <button 
            onClick={() => setFilter("approved")}
            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === 'approved' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Approved
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800">
          <div className="relative flex-1 max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by product, user, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Metadata</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Feedback / Rating</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Moderation</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-sans">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-8"><div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-8 py-8 align-top">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-600">
                            <Package size={14} />
                          </div>
                          <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight truncate max-w-[150px]">{review.product?.name || "Product Deleted"}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-tight">{review.user?.name || "Anonymous"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 align-top max-w-md">
                      <div className="space-y-3">
                        <div className="flex text-amber-400">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={2.5} className={i >= review.rating ? "text-slate-200 dark:text-slate-800" : ""} />
                           ))}
                        </div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                          "{review.comment}"
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-8 align-top">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-8 py-8 align-top">
                      <button 
                        onClick={() => handleToggleStatus(review._id, review.isApproved)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                          review.isApproved 
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100' 
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-100 dark:border-rose-500/20 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100'
                        }`}
                      >
                        {review.isApproved ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {review.isApproved ? 'Approved' : 'Authorize'}
                      </button>
                    </td>
                    <td className="px-8 py-8 align-top text-right">
                      <button 
                        onClick={() => handleDelete(review._id)}
                        className="p-3 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="bg-slate-50 dark:bg-slate-950 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                       <MessageSquare size={32} className="text-slate-200 dark:text-slate-800" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No reviews to moderate.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
