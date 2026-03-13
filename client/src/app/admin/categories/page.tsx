"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Plus, Trash2, ListTree, Search, ChevronRight, ChevronDown, MoveVertical, X } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  // Expanded nodes state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Form State
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState<number | "">("");
  
  // Helper to build a flat list of category options with hierarchy level
  const buildFlatList = (nodes: any[], level = 0, result: any[] = []) => {
    for (const node of nodes) {
      result.push({ ...node, level });
      if (node.children && node.children.length > 0) {
        buildFlatList(node.children, level + 1, result);
      }
    }
    return result;
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      // Load tree
      const resTree = await fetchApi("/categories/tree?includeInactive=true");
      setCategoryTree(resTree.data || []);
      
      // Load flat (if needed, but tree is enough usually. We can build flat from tree)
      const res = await fetchApi("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = JSON.stringify({ name, parent: parent || null, isActive, order });
      if (editingId) {
        await fetchApi(`/categories/${editingId}`, { method: "PUT", body: payload });
      } else {
        await fetchApi("/categories", { method: "POST", body: payload });
      }
      handleCancelForm();
      loadCategories();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save category");
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setName("");
    setParent("");
    setOrder("");
    setIsActive(true);
  };

  const handleEditClick = (node: any) => {
    setEditingId(node._id);
    setName(node.name);
    setParent(node.parent || "");
    setIsActive(node.isActive);
    setOrder(node.order || 1);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("bg-indigo-50", "border-indigo-400");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-indigo-50", "border-indigo-400");
  };

  const handleDrop = async (e: React.DragEvent, targetNode: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("bg-indigo-50", "border-indigo-400");
    
    if (!draggedId || draggedId === targetNode._id) return;
    
    try {
      // Find dragged Node
      const res = await fetchApi(`/categories/${draggedId}`);
      const draggedNode = res.data;

      await fetchApi(`/categories/${draggedId}`, {
         method: "PUT",
         body: JSON.stringify({
            order: targetNode.order, // Take target's order
            parent: targetNode.parent || null // And parent
         })
      });
      loadCategories();
    } catch(err: any) {
      alert("Error moving category");
    }
    setDraggedId(null);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${catName}"?`)) return;
    try {
      await fetchApi(`/categories/${id}`, { method: "DELETE" });
      loadCategories();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete category");
    }
  };

  const RenderTree = ({ nodes }: { nodes: any[] }) => {
    return (
      <ul className="divide-y divide-slate-50 dark:divide-slate-800/50">
        {nodes.map(node => (
          <li key={node._id} className="w-full">
            <div 
              draggable 
              onDragStart={(e) => handleDragStart(e, node._id)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, node)}
              className={`flex items-center justify-between p-5 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group relative overflow-hidden ${draggedId === node._id ? 'opacity-30 scale-95' : ''}`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="group/drag cursor-grab active:cursor-grabbing p-1.5 text-slate-300 hover:text-indigo-500 rounded-lg transition-colors flex-shrink-0" title="Drag to reorder">
                    <MoveVertical size={16} />
                </div>
                <button 
                  type="button"
                  onClick={() => toggleExpand(node._id)}
                  className={`p-2 rounded-xl transition-all flex-shrink-0 ${node.children?.length ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:scale-110 active:scale-95' : 'bg-transparent text-transparent pointer-events-none'}`}
                >
                  {expandedNodes[node._id] ? <ChevronDown size={14} className="font-bold" /> : <ChevronRight size={14} className="font-bold" />}
                </button>
                <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm group-hover:rotate-6 transition-transform">
                  <ListTree size={20} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{node.name}</h3>
                  <div className="flex items-center gap-4 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ID: {node.slug}</span>
                    <div className="flex items-center gap-1.5">
                       <div className={`h-1.5 w-1.5 rounded-full ${node.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${node.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {node.isActive ? 'Active' : 'Inactive'}
                       </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <div className="hidden sm:flex items-center justify-center bg-white dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-black px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  PRIORITY {node.order || 1}
                </div>
                <button 
                  onClick={() => handleEditClick(node)} 
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-all active:scale-90"
                  title="Configure"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <button 
                  onClick={() => handleDelete(node._id, node.name)} 
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 transition-all active:scale-90"
                  title="Terminate"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            
            {/* Children Render */}
            {node.children && node.children.length > 0 && expandedNodes[node._id] && (
              <div className="pl-10 mt-0 border-l-2 border-indigo-50/50 dark:border-indigo-500/10 ml-10 mb-4 animate-in slide-in-from-left-4 duration-500">
                <RenderTree nodes={node.children} />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const flatCategories = buildFlatList(categoryTree);

  const filteredTree = searchTerm 
      ? flatCategories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : categoryTree;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-secondary rounded-full" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Categories</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Organize your products with a hierarchical structure.</p>
        </div>
        <button
          onClick={() => {
             if (showAddForm) {
                 handleCancelForm();
             } else {
                 handleCancelForm();
                 setShowAddForm(true);
             }
          }}
          className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 ${
            showAddForm 
              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20' 
              : 'bg-secondary hover:opacity-90 text-white shadow-secondary/20'
          }`}
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-primary p-3 rounded-[1.25rem] shadow-lg shadow-primary/20">
              <ListTree className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Category Details</p>
            </div>
          </div>

          <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Category Name</label>
              <input 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" 
                placeholder="e.g. Master Tech" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Parent Category</label>
              <select 
                value={parent} 
                onChange={(e) => setParent(e.target.value)} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold appearance-none cursor-pointer"
              >
                <option value="">None (Root Category)</option>
                {flatCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {'\u00A0'.repeat(cat.level * 4)}{cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Priority Index</label>
              <input 
                type="number" 
                value={order} 
                onChange={(e) => setOrder(e.target.value === '' ? '' : Number(e.target.value))} 
                className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" 
                placeholder="1"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="group flex items-center cursor-pointer select-none">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-emerald-500 transition-all duration-300" />
                  <div className="content-[''] absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6 shadow-sm" />
                </div>
                <span className="ml-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Category Active</span>
              </label>
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-4 mt-4 border-t border-slate-100 dark:border-slate-800 pt-10">
              <button 
                type="button" 
                onClick={handleCancelForm} 
                className="px-8 py-4 text-xs font-black text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all uppercase tracking-widest border border-slate-100 dark:border-slate-800"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-10 py-4 text-xs font-black text-white bg-secondary rounded-2xl shadow-xl shadow-secondary/20 hover:opacity-90 hover:-translate-y-1 transition-all uppercase tracking-widest active:scale-95"
              >
                {editingId ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories View Filter & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative w-full max-w-xl group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-16 pr-8 py-5 border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem] bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
           <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Total Categories: {flatCategories.length}
           </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-900/50 rounded-2xl animate-pulse delay-[i*100ms] border border-slate-50 dark:border-slate-800"></div>
          ))}
        </div>
      ) : filteredTree.length > 0 ? (
        searchTerm ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTree.map((cat: any) => (
              <li key={cat._id} className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                      <ListTree size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-black text-slate-900 dark:text-white">{cat.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Slug: {cat.slug}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => handleEditClick(cat)}
                  className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all"
                 >
                   <ChevronRight size={18} />
                 </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm">
             <RenderTree nodes={filteredTree} />
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] p-24 text-center">
          <div className="bg-slate-50 dark:bg-slate-950 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <ListTree className="h-12 w-12 text-slate-200 dark:text-slate-800" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">No categories found</p>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2">Create your first category to get started.</p>
        </div>
      )}
    </div>
  );
}
