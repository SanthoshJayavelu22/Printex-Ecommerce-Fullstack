"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Phone, Mail, Camera, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await fetchApi("/auth/updateprofile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess(false);

    try {
      await fetchApi("/auth/updatepassword", {
        method: "PUT",
        body: JSON.stringify(passwordData),
      });
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setIsPasswordModalOpen(false), 2000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-44 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">My Profile</h1>
            <p className="text-slate-500 font-medium">Manage your personal information and contact details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Action Cards */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <User size={64} strokeWidth={1.5} />
                  </div>
                  <button className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-secondary transition-colors">
                    <Camera size={20} />
                  </button>
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-1">{user?.name}</h2>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">{user?.role || 'Customer'}</p>
                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                      <Mail size={14} />
                    </div>
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                      <Phone size={14} />
                    </div>
                    <span>{user?.phoneNumber || 'No phone added'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary rounded-3xl p-8 text-white">
                <h3 className="text-lg font-black uppercase tracking-tight mb-4">Security</h3>
                <p className="text-slate-400 text-sm mb-6">Keep your account secure by using a strong password.</p>
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl transition-all text-xs uppercase tracking-widest border border-white/10"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Edit Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 size={18} /> Profile updated successfully!
                    </div>
                  )}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Name</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                        <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none rounded-2xl px-14 py-4 font-bold text-slate-900 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                        <Phone size={18} />
                      </div>
                      <input 
                        type="tel" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none rounded-2xl px-14 py-4 font-bold text-slate-900 transition-all"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        disabled
                        value={user?.email || ""}
                        className="w-full bg-slate-100 border-2 border-transparent rounded-2xl px-14 py-4 font-bold text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium ml-4 italic">Email address cannot be changed.</p>
                  </div>

                  <div className="pt-6">
                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full bg-secondary text-white font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-secondary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Change Password</h2>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-8 space-y-6">
              {passwordSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-sm">
                  Password updated successfully!
                </div>
              )}
              {passwordError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-sm">
                  {passwordError}
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="pt-4 flex gap-4">
                 <button 
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl text-xs uppercase tracking-widest"
                 >
                   Cancel
                 </button>
                 <button 
                  disabled={passwordLoading}
                  type="submit"
                  className="flex-[2] bg-secondary text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 transition-all shadow-lg shadow-secondary/20"
                 >
                   {passwordLoading ? <Loader2 className="animate-spin" size={16} /> : "Update Password"}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
