"use client";

import { useEffect, useState } from "react";
import { fetchApi, getImageUrl, API_URL } from "@/lib/api";
import { Plus, Trash2, Edit, Search, Filter, Box, RefreshCw, X } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    defaultShape: "",
    defaultSize: "",
    defaultQuantity: "",
    defaultMaterial: "",
    isActive: true,
    fixedShape: false,
    fixedSize: false,
    fixedMaterial: false,
    fixedQuantity: false,
  });
  const [availableShapes, setAvailableShapes] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);
  const [availableQuantities, setAvailableQuantities] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRelated, setSelectedRelated] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [quantityDiscounts, setQuantityDiscounts] = useState<{minQuantity: number, discountPercentage: number}[]>([]);
  
  // Raw input states for comma separation to avoid cursor jumping
  const [shapesInput, setShapesInput] = useState("");
  const [sizesInput, setSizesInput] = useState("");
  const [materialsInput, setMaterialsInput] = useState("");
  const [quantitiesInput, setQuantitiesInput] = useState("");


  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/products?limit=100");
      setProducts(res.data || res.products || res || []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetchApi("/categories/tree");
      setCategoryTree(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleRelatedToggle = (id: string) => {
    setSelectedRelated(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImagePreview = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addDiscountTier = () => {
    setQuantityDiscounts([...quantityDiscounts, { minQuantity: 0, discountPercentage: 0 }]);
  };

  const removeDiscountTier = (index: number) => {
    setQuantityDiscounts(quantityDiscounts.filter((_, i) => i !== index));
  };

  const handleDiscountChange = (index: number, field: string, value: string) => {
    const updated = [...quantityDiscounts];
    updated[index] = { ...updated[index], [field]: Number(value) };
    setQuantityDiscounts(updated);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePreviews.length === 0 && selectedCategories.length === 0) {
      alert("Please upload at least one image and select at least one category.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    if(formData.metaTitle) payload.append("metaTitle", formData.metaTitle);
    if(formData.metaDescription) payload.append("metaDescription", formData.metaDescription);
    if(formData.metaKeywords) payload.append("metaKeywords", formData.metaKeywords);
    payload.append("defaultShape", formData.defaultShape);
    payload.append("defaultSize", formData.defaultSize);
    payload.append("defaultQuantity", formData.defaultQuantity);
    payload.append("defaultMaterial", formData.defaultMaterial);
    payload.append("isActive", formData.isActive.toString());
    payload.append("fixedShape", formData.fixedShape.toString());
    payload.append("fixedSize", formData.fixedSize.toString());
    payload.append("fixedMaterial", formData.fixedMaterial.toString());
    payload.append("fixedQuantity", formData.fixedQuantity.toString());
    payload.append("availableShapes", JSON.stringify(availableShapes));
    payload.append("availableSizes", JSON.stringify(availableSizes));
    payload.append("availableMaterials", JSON.stringify(availableMaterials));
    payload.append("availableQuantities", JSON.stringify(availableQuantities));
    payload.append("quantityDiscounts", JSON.stringify(quantityDiscounts));
    selectedCategories.forEach(c => payload.append("categories", c));
    selectedRelated.forEach(p => payload.append("relatedProducts", p));
    
    if (images.length > 0) {
      payload.append("mainImage", images[0]);
      for (let i = 1; i < images.length; i++) {
        payload.append("additionalImages", images[i]);
      }
    }

    // Pass existing image URLs that weren't deleted
    if (editingId) {
      imagePreviews.forEach(preview => {
        // Only pass backend URLs (skip blob: URLs which are new files)
        const serverBase = API_URL.replace(/\/api$/, '');
        if (preview.startsWith(serverBase)) {
            // Strip the local domain prefix to match backend DB stored format
            const originalDbPath = preview.replace(serverBase + '/', "");
            payload.append("existingImages", originalDbPath);
        } else if (preview.startsWith("http")) {
            // For external urls fallback
            payload.append("existingImages", preview);
        }
      });
    }

    try {
      if (editingId) {
        await fetchApi(`/products/${editingId}`, { method: "PUT", body: payload });
      } else {
        await fetchApi("/products", { method: "POST", body: payload });
      }
      handleCancelForm();
      loadProducts();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save product");
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ 
      name: "", 
      description: "", 
      price: "", 
      metaTitle: "", 
      metaDescription: "", 
      metaKeywords: "", 
      defaultShape: "", 
      defaultSize: "", 
      defaultQuantity: "", 
      defaultMaterial: "",
      isActive: true,
      fixedShape: false,
      fixedSize: false,
      fixedMaterial: false,
      fixedQuantity: false,
    });
    setAvailableShapes([]);
    setAvailableSizes([]);
    setAvailableMaterials([]);
    setAvailableQuantities([]);
    setSelectedCategories([]);
    setSelectedRelated([]);
    setImages([]);
    setImagePreviews([]);
    setQuantityDiscounts([]);
    setShapesInput("");
    setSizesInput("");
    setMaterialsInput("");
    setQuantitiesInput("");
  };

  const handleEditClick = async (prod: any) => {
     // Fetch full product for edit (gives related products properly)
     try {
       const res = await fetchApi(`/products/${prod._id}`);
       const fullProd = res.data || res;
       
       setFormData({
         name: fullProd.name || "",
         description: fullProd.description || "",
         price: fullProd.price || "",
         metaTitle: fullProd.metaTitle || "",
         metaDescription: fullProd.metaDescription || "",
         metaKeywords: fullProd.metaKeywords || "",
         defaultShape: fullProd.defaultShape || "",
         defaultSize: fullProd.defaultSize || "",
          defaultQuantity: fullProd.defaultQuantity?.toString() || "",
          defaultMaterial: fullProd.defaultMaterial || "",
          isActive: fullProd.isActive !== undefined ? fullProd.isActive : true,
          fixedShape: !!fullProd.fixedShape,
          fixedSize: !!fullProd.fixedSize,
          fixedMaterial: !!fullProd.fixedMaterial,
          fixedQuantity: !!fullProd.fixedQuantity,
        });
        setAvailableShapes(fullProd.availableShapes || []);
        setAvailableSizes(fullProd.availableSizes || []);
        setAvailableMaterials(fullProd.availableMaterials || []);
        setAvailableQuantities(fullProd.availableQuantities || []);
        
        setShapesInput((fullProd.availableShapes || []).join(", "));
        setSizesInput((fullProd.availableSizes || []).join(", "));
        setMaterialsInput((fullProd.availableMaterials || []).join(", "));
        setQuantitiesInput((fullProd.availableQuantities || []).join(", "));
       if (fullProd.categories && fullProd.categories.length) {
         setSelectedCategories(fullProd.categories.map((c: any) => c._id ? c._id : c));
       } else {
         setSelectedCategories([]);
       }
       
       if (fullProd.relatedProducts && fullProd.relatedProducts.length) {
         setSelectedRelated(fullProd.relatedProducts.map((p: any) => p._id ? p._id : p));
       } else {
         setSelectedRelated([]);
       }

       setQuantityDiscounts(fullProd.quantityDiscounts || []);

       if (fullProd.images && fullProd.images.length > 0) {
         setImagePreviews(fullProd.images.map((img: string) => getImageUrl(img)));
         setImages([]); // Reset any pending files
       } else {
         setImagePreviews([]);
         setImages([]);
       }

       // Images will remain existing on backend string format unless overwritten
       
       setEditingId(fullProd._id);
       setShowAddForm(true);
       window.scrollTo({ top: 0, behavior: 'smooth' });
     } catch (err) {
       console.error("Failed to load product details", err);
     }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await fetchApi(`/products/${id}`, { method: "DELETE" });
      loadProducts();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete product");
    }
  };

  const renderCategoryCheckboxes = (nodes: any[], level = 0) => {
    return nodes.map(node => (
      <div key={node._id} className="w-full">
        <label className={`flex items-center cursor-pointer py-1.5 px-3 rounded-xl transition-all hover:bg-white dark:hover:bg-slate-900 group ${level > 0 ? "ml-6 border-l-2 border-slate-100 dark:border-slate-800/50 pl-4" : ""}`}>
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              checked={selectedCategories.includes(node._id)}
              onChange={() => handleCategoryToggle(node._id)}
              className="sr-only peer"
            />
            <div className={`h-4 w-4 rounded-md border-2 transition-all flex items-center justify-center ${selectedCategories.includes(node._id) ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-slate-300 dark:border-slate-700 group-hover:border-indigo-400'}`}>
               {selectedCategories.includes(node._id) && <div className="h-1.5 w-1.5 bg-white rounded-sm" />}
            </div>
            <span className={`ml-3 text-[11px] font-black uppercase tracking-widest transition-colors ${selectedCategories.includes(node._id) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
              {node.name}
            </span>
          </div>
        </label>
        {node.children && node.children.length > 0 && (
          <div className="mt-0.5 mb-1">
            {renderCategoryCheckboxes(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const filteredProducts = Array.isArray(products) 
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) 
    : [];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,68,65,0.3)]" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Product Catalog</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-3.5">Inventory management and digital storefront control.</p>
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
          {showAddForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500">
           <div className="flex items-center gap-4 mb-10">
            <div className="bg-gradient-to-tr from-primary to-primary-focus p-3 rounded-[1.25rem] shadow-lg shadow-primary/20">
              <Box className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {editingId ? "Edit Product" : "New Product"}
              </h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product Details</p>
            </div>
          </div>

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-8 space-y-10">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-4 bg-secondary rounded-full" />
                  <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Product Name</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" placeholder="e.g. Round Custom Sticker" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Unit Price (₹)</label>
                    <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold" placeholder="0.00" />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Product Categories</label>
                    <div className="bg-slate-50/50 dark:bg-slate-950/50 rounded-[1.25rem] border border-slate-100 dark:border-slate-800 p-6 max-h-[160px] overflow-y-auto no-scrollbar">
                        {categoryTree.length > 0 ? renderCategoryCheckboxes(categoryTree) : <span className="text-[10px] font-bold text-slate-400 uppercase italic">No Categories Available</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Product Description (HTML Supported)</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-4 px-6 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold min-h-[150px]" placeholder="Detailed product specifications..." />
                </div>
              </div>

              {/* Technical Defaults */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-4 bg-primary rounded-full" />
                  <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Product Customization & Defaults</h3>
                </div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
                  Define the available options for this product. You can "Lock" a selection to force a specific value for the user.
                  <br />
                  <span className="text-secondary italic">Note: Type available options in the text box first, then select the default from the dropdown.</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Shape Configuration */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Shape Options</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={formData.fixedShape} 
                          onChange={(e) => setFormData({...formData, fixedShape: e.target.checked})} 
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-[9px] font-black uppercase text-slate-500">Lock Selection</span>
                      </div>
                    </div>
                    <select name="defaultShape" value={formData.defaultShape} onChange={(e: any) => setFormData({...formData, defaultShape: e.target.value})} className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white">
                        <option value="">Choose Default</option>
                        {availableShapes.length > 0 ? (
                          availableShapes.map(s => <option key={s} value={s}>{s}</option>)
                        ) : (
                          <>
                            <option value="Round">Round</option>
                            <option value="Square / Rectangle">Square / Rectangle</option>
                            <option value="Oval">Oval</option>
                            <option value="Custom/Any Shape">Custom/Any Shape</option>
                          </>
                        )}
                    </select>
                    <input 
                      type="text" 
                      placeholder="Available Shapes (comma separated)" 
                      value={shapesInput} 
                      onChange={(e) => {
                        setShapesInput(e.target.value);
                        setAvailableShapes(e.target.value.split(",").map(v => v.trim()).filter(v => v));
                      }}
                      className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white" 
                    />
                  </div>

                  {/* Size Configuration */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Size Options</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={formData.fixedSize} 
                          onChange={(e) => setFormData({...formData, fixedSize: e.target.checked})} 
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-[9px] font-black uppercase text-slate-500">Lock Selection</span>
                      </div>
                    </div>
                    <select name="defaultSize" value={formData.defaultSize} onChange={(e: any) => setFormData({...formData, defaultSize: e.target.value})} className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white">
                        <option value="">Choose Default</option>
                        {availableSizes.length > 0 ? (
                          availableSizes.map(s => <option key={s} value={s}>{s}</option>)
                        ) : (
                          <>
                            <option value="2in x 2in">2in x 2in</option>
                            <option value="3in x 3in">3in x 3in</option>
                            <option value="4in x 4in">4in x 4in</option>
                            <option value="Custom Size">Custom Size</option>
                          </>
                        )}
                    </select>
                    <input 
                      type="text" 
                      placeholder="Available Sizes (comma separated)" 
                      value={sizesInput} 
                      onChange={(e) => {
                        setSizesInput(e.target.value);
                        setAvailableSizes(e.target.value.split(",").map(v => v.trim()).filter(v => v));
                      }}
                      className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white" 
                    />
                  </div>

                  {/* Material Configuration */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Material Options</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={formData.fixedMaterial} 
                          onChange={(e) => setFormData({...formData, fixedMaterial: e.target.checked})} 
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-[9px] font-black uppercase text-slate-500">Lock Selection</span>
                      </div>
                    </div>
                    <select name="defaultMaterial" value={formData.defaultMaterial} onChange={(e: any) => setFormData({...formData, defaultMaterial: e.target.value})} className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white">
                        <option value="">Choose Default</option>
                        {availableMaterials.length > 0 ? (
                          availableMaterials.map(s => <option key={s} value={s}>{s}</option>)
                        ) : (
                          <>
                            <option value="Standard">Standard</option>
                            <option value="Water-Resist">Water-Resist</option>
                            <option value="Transparent">Transparent</option>
                            <option value="Brown Kraft">Brown Kraft</option>
                          </>
                        )}
                    </select>
                    <input 
                      type="text" 
                      placeholder="Available Materials (comma separated)" 
                      value={materialsInput} 
                      onChange={(e) => {
                        setMaterialsInput(e.target.value);
                        setAvailableMaterials(e.target.value.split(",").map(v => v.trim()).filter(v => v));
                      }}
                      className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white" 
                    />
                  </div>

                  {/* Quantity Configuration */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Quantity Options</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={formData.fixedQuantity} 
                          onChange={(e) => setFormData({...formData, fixedQuantity: e.target.checked})} 
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-[9px] font-black uppercase text-slate-500">Lock Selection</span>
                      </div>
                    </div>
                    <select name="defaultQuantity" value={formData.defaultQuantity} onChange={(e: any) => setFormData({...formData, defaultQuantity: e.target.value})} className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white">
                        <option value="">Choose Default</option>
                        {availableQuantities.length > 0 ? (
                          availableQuantities.map(q => <option key={q} value={q}>{q}</option>)
                        ) : (
                          <>
                            <option value="100">100</option>
                            <option value="250">250</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                          </>
                        )}
                    </select>
                    <input 
                      type="text" 
                      placeholder="Available Quantities (comma separated)" 
                      value={quantitiesInput} 
                      onChange={(e) => {
                        setQuantitiesInput(e.target.value);
                        setAvailableQuantities(e.target.value.split(",").map(v => v.trim()).filter(v => !isNaN(Number(v))).map(Number));
                      }}
                      className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Quantity Discount Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-4 bg-secondary rounded-full shadow-[0_0_10px_rgba(243,119,33,0.3)]" />
                    <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Bulk Purchase Discounts</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={addDiscountTier}
                    className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-slate-800 text-white dark:text-primary rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 border border-primary/20"
                  >
                    <Plus size={14} /> Add Discount Tier
                  </button>
                </div>

                <div className="space-y-3">
                  {quantityDiscounts.length > 0 ? (
                    quantityDiscounts.map((tier, idx) => (
                      <div key={idx} className="flex flex-wrap sm:flex-nowrap items-end gap-6 p-6 bg-slate-50/50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-left-4 duration-500 group/tier">
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1">Threshold Quantity</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={tier.minQuantity} 
                              onChange={(e) => handleDiscountChange(idx, 'minQuantity', e.target.value)}
                              className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                              placeholder="e.g. 100"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Units</div>
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1">Discount Rate (%)</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={tier.discountPercentage} 
                              onChange={(e) => handleDiscountChange(idx, 'discountPercentage', e.target.value)}
                              className="block w-full rounded-[1.25rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-3.5 px-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                              placeholder="e.g. 10"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-emerald-500">%</div>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeDiscountTier(idx)}
                          className="p-4 bg-white dark:bg-slate-800 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100 dark:border-slate-800 mb-[2px] active:scale-95"
                          title="Remove Tier"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-slate-50/20 dark:bg-slate-950/10">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <RefreshCw size={24} />
                      </div>
                      <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">No volume discounts configured</p>
                      <p className="text-[10px] font-bold text-slate-400/40 uppercase tracking-widest mt-2">Incentivize bulk orders by adding discount tiers.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Logic */}
              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800/50 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">SEO Configuration</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Index Title</label>
                    <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 py-3.5 px-5 text-sm font-bold text-slate-900 dark:text-white" placeholder="Max 60 characters..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Meta Narrative</label>
                    <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 py-3.5 px-5 text-sm font-bold text-slate-900 dark:text-white min-h-[80px]" placeholder="Max 155 characters..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Meta Keywords</label>
                    <input name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} className="block w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 py-3.5 px-5 text-sm font-bold text-slate-900 dark:text-white" placeholder="keyword1, keyword2..." />
                  </div>
                  <div className="flex items-center pt-4">
                    <label className="group flex items-center cursor-pointer select-none">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={formData.isActive} 
                          onChange={(e: any) => setFormData({...formData, isActive: e.target.checked})} 
                          className="sr-only peer" 
                        />
                        <div className="w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-indigo-600 transition-all duration-300" />
                        <div className="content-[''] absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6 shadow-sm" />
                      </div>
                      <span className="ml-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Visible on Frontend (Active)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Visual Assets</label>
                  <span className="text-[10px] font-bold text-indigo-500">{imagePreviews.length}/6</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 aspect-square shadow-sm hover:shadow-md transition-all">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button type="button" onClick={() => removeImagePreview(idx)} className="bg-white p-2.5 rounded-xl text-rose-500 hover:scale-110 transition-all">
                                  <Trash2 size={16} />
                              </button>
                            </div>
                            {idx === 0 && <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-indigo-600 text-[8px] font-black text-white rounded uppercase tracking-tighter">Primary</span>}
                        </div>
                    ))}
                    
                    {imagePreviews.length < 6 && (
                      <div className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-950/20 transition-all group overflow-hidden">
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform mb-2">
                               <Plus className="h-4 w-4 text-indigo-500" />
                            </div>
                             <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Add Image</p>
                          </div>
                          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                    )}
                </div>
                <p className="text-[10px] font-bold text-slate-400 italic">Upload up to 6 high-res JPG/PNG images.</p>
              </div>

              {/* Related Synergy */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest pl-1">Related Products</label>
                 <div className="max-h-[300px] overflow-y-auto no-scrollbar border border-slate-100 dark:border-slate-800 rounded-[1.5rem] bg-slate-50/30 dark:bg-slate-950/30 p-2 space-y-1">
                  {products.length > 0 ? products.filter(p => !editingId || p._id !== editingId).map((p) => (
                    <label key={p._id} className={`flex items-center p-3 rounded-xl transition-all cursor-pointer group ${selectedRelated.includes(p._id) ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      <input
                        type="checkbox"
                        checked={selectedRelated.includes(p._id)}
                        onChange={() => handleRelatedToggle(p._id)}
                        className="sr-only"
                      />
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center mr-3 border transition-colors ${selectedRelated.includes(p._id) ? 'bg-white text-indigo-600 border-indigo-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                         {selectedRelated.includes(p._id) && <Box size={12} className="fill-indigo-600" />}
                      </div>
                      <span className="text-[11px] font-bold truncate">{p.name}</span>
                    </label>
                  )) : <div className="p-8 text-center text-xs text-slate-400 italic font-bold">No other products found</div>}
                </div>
              </div>
            </div>

            <div className="md:col-span-12 flex justify-end gap-4 mt-8 border-t border-slate-100 dark:border-slate-800 pt-10">
              <button type="button" onClick={handleCancelForm} className="px-8 py-4 text-xs font-black text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                Cancel
              </button>
              <button type="submit" className="px-12 py-4 text-xs font-black text-white bg-secondary rounded-2xl shadow-xl shadow-secondary/20 hover:opacity-90 hover:-translate-y-1 transition-all uppercase tracking-widest active:scale-95">
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Database View / Grid */}
      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 pb-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full max-w-lg group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-14 pr-6 py-4 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-950/50 text-sm font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-3">
             <div className="px-6 py-3.5 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Total Products: {filteredProducts.length}</span>
             </div>
            <button onClick={loadProducts} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all active:scale-90 overflow-hidden">
               <RefreshCw size={18} className={`text-slate-400 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto px-6 py-4">
          {loading && currentProducts.length === 0 ? (
            <div className="p-24 text-center">
               <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
               <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Loading products...</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 dark:text-slate-500">
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Product / Identifier</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Categories</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Price</th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {currentProducts.length > 0 ? currentProducts.map((prod: any) => (
                  <tr key={prod._id} className="bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-800 transition-all group hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                    <td className="px-6 py-4 first:rounded-l-[1.5rem]">
                        <div className="flex items-center gap-4">
                            {prod.images && prod.images.length > 0 ? (
                                <div className="h-14 w-14 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                  <img src={getImageUrl(prod.images[0])} alt="" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="h-14 w-14 bg-white dark:bg-slate-900 flex items-center justify-center rounded-2xl border border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-700 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Box size={24} />
                                </div>
                            )}
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[200px]">{prod.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 font-mono tracking-tighter uppercase">{prod.slug}</span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                          {prod.categories && prod.categories.length > 0 ? prod.categories.map((c: any) => (
                              <span key={c._id || c} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                {c.name || 'Unknown'}
                              </span>
                          )) : (
                              <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase italic">Unassigned</span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          ₹{prod.price?.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                           <div className={`h-1.5 w-1.5 rounded-full ${prod.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                           <span className={`text-[9px] font-black uppercase tracking-widest ${prod.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {prod.isActive ? 'Operational' : 'Disabled'}
                           </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 last:rounded-r-[1.5rem] text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button onClick={() => handleEditClick(prod)} className="p-3 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 rounded-[1rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all active:scale-95">
                          <Edit size={16} strokeWidth={2.5} />
                        </button>
                        <button onClick={() => handleDelete(prod._id, prod.name)} className="p-3 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 rounded-[1rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-24 text-center">
                       <div className="p-10 bg-slate-50 dark:bg-slate-950/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 max-w-sm mx-auto">
                        <Box size={40} className="text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">No products found</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">Try adjusting your search or add a new product.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Logic Modernized */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-slate-50 dark:border-slate-800/50 flex justify-center">
             <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
               {Array.from({ length: totalPages }).map((_, i) => (
                 <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-10 w-10 rounded-xl text-xs font-black transition-all duration-300 ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900'}`}
                 >
                   {i + 1}
                 </button>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
