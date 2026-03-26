"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Trash2, Search, Users, ShieldAlert, BadgeCheck, Mail, RefreshCw, ChevronDown } from "lucide-react";
import { useAlertModal } from "@/contexts/ModalContext";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { showAlert, showConfirm } = useAlertModal();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/users");
      setUsers(res.data || res.users || res);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    showConfirm(
      "Change User Role",
      `Are you sure you want to change this user's role to ${newRole}? This affects their permissions.`,
      async () => {
        try {
          await fetchApi(`/users/${id}`, {
            method: "PUT",
            body: JSON.stringify({ role: newRole }),
          });
          loadUsers();
          showAlert("Updated", "User role has been updated successfully.", "success");
        } catch (err: any) {
          console.error(err);
          showAlert("Update Error", err.message || "Failed to update role", "error");
        }
      },
      undefined,
      "info"
    );
  };

  const handleDelete = async (id: string, name: string) => {
    showConfirm(
      "Delete User",
      `Are you sure you want to delete user ${name} permanently? This action cannot be undone.`,
      async () => {
        try {
          await fetchApi(`/users/${id}`, { method: "DELETE" });
          loadUsers();
          showAlert("Deleted", "User has been removed successfully.", "success");
        } catch (err: any) {
          console.error(err);
          showAlert("Delete Error", err.message || "Failed to delete user", "error");
        }
      },
      undefined,
      "alert"
    );
  };

  const filteredUsers = Array.isArray(users) 
    ? users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())) 
    : [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'super-admin': return <ShieldAlert size={16} className="text-rose-600" />;
      case 'admin': return <BadgeCheck size={16} className="text-primary" />;
      default: return <Users size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,68,65,0.3)]" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">User Registry</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Audit and manage the platform's core user ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admins</span>
              </div>
              <div className="w-px h-4 bg-slate-100 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customers</span>
              </div>
           </div>
           <button onClick={loadUsers} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-90">
             <RefreshCw size={18} className={`text-slate-400 ${loading ? "animate-spin text-indigo-500" : ""}`} />
           </button>
        </div>
      </div>

      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full max-w-lg group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-950/50 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
          
          <div className="px-6 py-3.5 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
             <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Total Users: {filteredUsers.length}</span>
          </div>
        </div>

        <div className="p-8">
          {loading && users.length === 0 ? (
            <div className="p-24 text-center">
              <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Loading users...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentUsers.length > 0 ? currentUsers.map((user: any) => (
                <div key={user._id} className="group relative bg-slate-50/50 dark:bg-slate-955/50 border border-transparent dark:border-slate-800/50 rounded-[2rem] p-6 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  {user.role !== 'super-admin' && (
                    <button 
                      onClick={() => handleDelete(user._id, user.name)} 
                      className="absolute top-4 right-4 h-10 w-10 rounded-2xl bg-white dark:bg-slate-900 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 z-10"
                      title="Delete User"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  )}

                  <div className="flex flex-col items-center text-center mt-2 flex-grow">
                    <div className="relative mb-6">
                      <div className={`h-24 w-24 rounded-[2rem] flex items-center justify-center text-2xl font-black shadow-xl transition-all duration-500 group-hover:rotate-6 ${
                        user.role === 'super-admin' ? 'bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-rose-500/20' : 
                        user.role === 'admin' ? 'bg-gradient-to-br from-primary to-[#3a635f] text-white shadow-primary/20' : 
                        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-slate-200/50'
                      }`}>
                        {(user.name || "U")[0].toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 p-2 rounded-xl border-4 border-white dark:border-slate-800 shadow-md ${
                        user.role === 'super-admin' ? 'bg-purple-600 text-white' :
                        user.role === 'admin' ? 'bg-indigo-600 text-white' :
                        'bg-slate-400 text-white'
                      }`}>
                        {getRoleIcon(user.role)}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white truncate w-full px-2 mt-2 leading-tight" title={user.name}>{user.name}</h3>
                    <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm w-full">
                       <Mail size={12} className="shrink-0 text-slate-400" /> 
                       <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate tracking-tight">{user.email}</p>
                    </div>

                    <div className="w-full mt-8">
                       <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2 block text-left ml-1">User Role</label>
                       <div className="relative group/select">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={user.role === 'super-admin'}
                            className={`block w-full text-[10px] py-3 pl-4 pr-10 rounded-xl font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 appearance-none outline-none focus:ring-4 transition-all cursor-pointer ${
                              user.role === 'super-admin' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 opacity-80 cursor-not-allowed' :
                              user.role === 'admin' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 focus:ring-indigo-500/10' :
                              'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:ring-slate-500/10'
                            }`}
                          >
                             <option value="user">Customer</option>
                            <option value="admin">Admin</option>
                            {user.role === 'super-admin' && <option value="super-admin">Super Admin</option>}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover/select:translate-y-0.5 transition-transform" />
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors">
                    <div className="flex items-center justify-between">
                       <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Registered</p>
                       <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                       </p>
                    </div>
                  </div>
                </div>
              )) : (
                 <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 py-32 text-center">
                  <div className="bg-slate-100 dark:bg-slate-950/50 p-10 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 max-w-sm mx-auto flex flex-col items-center">
                    <Users size={40} className="text-slate-200 dark:text-slate-800 mb-4" />
                    <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest">No Users Found</p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">Try adjusting your search or check back later.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination Modernized */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 p-8">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Page <span className="text-slate-900 dark:text-white">{currentPage}</span> of <span className="text-slate-900 dark:text-white">{totalPages}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-10 w-10 rounded-xl text-xs font-black transition-all duration-300 ${currentPage === i + 1 ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
