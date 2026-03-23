"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { ChevronRight, Filter, ShoppingBag, LayoutGrid, ArrowDownAZ, LayoutList, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadCategoryContext();
  }, [slug]);

  useEffect(() => {
    if (category) {
      loadProducts(page, sort);
    }
  }, [category, page, sort]);

  // Load category details and subcategories
  const loadCategoryContext = async () => {
    setLoading(true);
    try {
      const treeRes = await fetchApi("/categories/tree");
      const tree = treeRes.data || [];
      setCategoryTree(tree);
      
      const flattenCategories = (nodes: any[], path: any[] = []): any[] => {
        let result: any[] = [];
        for (const node of nodes) {
          const currentPath = [...path, { name: node.name, slug: node.slug }];
          if (node.slug === slug) {
            result.push({ ...node, breadcrumbs: currentPath });
          }
          if (node.children?.length) {
             result = result.concat(flattenCategories(node.children, currentPath));
          }
        }
        return result;
      };
      
      const flat = flattenCategories(tree);
      const foundCategory = flat.find((c: any) => c.slug === slug);
      
      if (foundCategory) {
        setCategory(foundCategory);
        setSubcategories(foundCategory.children || []);
      }
    } catch (err) {
      console.error("Failed to load category context", err);
    }
  };

  const loadProducts = async (currentPage: number, currentSort: string) => {
    try {
      const res = await fetchApi(`/products/category/${slug}?page=${currentPage}&limit=12&sort=${currentSort}`);
      setProducts(res.data || []);
      setTotalPages(Math.ceil((res.total || 0) / 12));
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-44 pb-16 flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-slate-400 font-black tracking-widest uppercase text-[10px]">Loading Collection...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!category && !loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-44 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-primary/5 border border-slate-100 max-w-lg w-full">
            <h1 className="text-4xl font-black text-primary uppercase tracking-tighter mb-4">Collection Not Found</h1>
            <p className="text-slate-500 mb-8 font-medium">We couldn't find the category you were looking for. It might have been moved or deleted.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-secondary transition-all shadow-xl shadow-primary/10">
              Return Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-44 pb-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 xl:px-24">
          
          {/* Breadcrumbs - Clean & Modern */}
          <nav className="flex items-center gap-3 mb-12 text-[10px] font-black uppercase tracking-widest text-slate-400 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 active:scale-95">Home</Link>
            {category?.breadcrumbs?.slice(0, -1).map((crumb: any, idx: number) => (
              <span key={idx} className="flex items-center gap-3">
                <ChevronRight size={12} className="text-slate-300" />
                <Link href={`/category/${crumb.slug}`} className="hover:text-primary transition-colors active:scale-95">{crumb.name}</Link>
              </span>
            ))}
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-primary">{category?.name}</span>
          </nav>

          {/* Category Header - High Impact */}
          <div className="bg-primary rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-primary/20 mb-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 transition-transform duration-[3000ms] group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex-1 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 bg-secondary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 shadow-lg shadow-secondary/20">
                Category
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
                {category?.name}
              </h1>
              <p className="text-white/60 font-bold max-w-xl leading-relaxed text-sm md:text-base">
                {category?.description || "Explore our premium selection of solutions. Crafted with absolute precision for high-impact results."}
              </p>
            </div>
            
            {category?.image && (
              <div className="relative z-10 shrink-0">
                <div className="h-48 w-48 md:h-64 md:w-64 bg-white/5 rounded-[2.5rem] p-4 backdrop-blur-xl border border-white/10 shadow-3xl">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="h-full w-full object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar / Filters */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-52 space-y-10">
                {/* Subcategories */}
                {subcategories.length > 0 && (
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Sub Collections</h3>
                    <div className="flex flex-col gap-3">
                      {subcategories.map(sub => (
                        <Link 
                          key={sub._id} 
                          href={`/category/${sub.slug}`}
                          className="flex items-center justify-between group p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        >
                          <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-secondary transition-colors">
                            {sub.name}
                          </span>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sorting */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Display Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-3">Sort Results</label>
                      <select 
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 text-primary py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all cursor-pointer appearance-none"
                      >
                        <option value="-createdAt">New Arrivals</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="name">Product Name: A-Z</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-3">View Mode</label>
                      <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0">
                        <button 
                          onClick={() => setLayout('grid')} 
                          className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${layout === 'grid' ? 'bg-white text-primary shadow-sm scale-105' : 'text-slate-400'}`}
                        >
                          <LayoutGrid size={16} />
                        </button>
                        <button 
                          onClick={() => setLayout('list')} 
                          className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${layout === 'list' ? 'bg-white text-primary shadow-sm scale-105' : 'text-slate-400'}`}
                        >
                          <LayoutList size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Products Section */}
              <div className="mb-8 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Displaying <span className="text-primary">{products.length}</span> Solutions
                </p>
              </div>

              {loading && products.length === 0 ? (
                <div className={`grid gap-8 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm animate-pulse">
                      <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6"></div>
                      <div className="h-4 bg-slate-50 rounded-full w-3/4 mb-4"></div>
                      <div className="h-4 bg-slate-50 rounded-full w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className={`grid gap-8 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      slug={product.slug}
                      name={product.name}
                      material={product.defaultMaterial || (product.categories?.[0]?.name) || "Premium"}
                      rating={5}
                      price={product.price}
                      image={product.images?.[0] || '/placeholder.png'}
                      size={product.defaultSize}
                      qty={product.defaultQuantity}
                      layout={layout}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm shadow-primary/5">
                  <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShoppingBag className="h-10 w-10 text-slate-200" />
                  </div>
                  <h3 className="text-3xl font-black text-primary uppercase tracking-tighter mb-4">No products found</h3>
                  <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 text-sm">We couldn't find any products in this collection. Try adjusting your sorting or explore other categories.</p>
                  <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-secondary hover:translate-x-1 transition-all">
                    Back to Catalog <ChevronRight size={14} />
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <div className="flex gap-3 bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-slate-100 p-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`h-12 w-12 rounded-2xl font-black text-xs transition-all ${page === i + 1 ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110' : 'text-slate-400 hover:bg-slate-50'} `}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
