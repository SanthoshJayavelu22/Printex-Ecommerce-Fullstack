"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApi, getImageUrl } from "@/lib/api";
import Link from "next/link";
import { ChevronRight, ShoppingBag, LayoutGrid, ArrowDownAZ, LayoutList, Search, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (query) {
      loadProducts(1, sort);
    }
  }, [query, sort]);

  const loadProducts = async (currentPage: number, currentSort: string) => {
    setLoading(true);
    try {
      const res = await fetchApi(`/products?keyword=${encodeURIComponent(query)}&page=${currentPage}&limit=12&sort=${currentSort}`);
      setProducts(res.data || []);
      setTotalPages(Math.ceil((res.total || 0) / 12));
    } catch (err) {
      console.error("Failed to load search results", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-semibold text-slate-500">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-900">Search Results</span>
        </nav>

        {/* Search Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-3">Search Results for</p>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">"{query}"</h1>
            </div>
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Found <span className="text-slate-900">{products.length}</span> matching items</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary rounded-lg text-white">
                <Filter size={14} />
             </div>
             <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] font-black">Sort & Filter</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none w-full sm:w-48 bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm transition-all cursor-pointer"
              >
                <option value="-createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ArrowDownAZ size={16} />
              </div>
            </div>
            
            <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm p-1 shrink-0">
              <button 
                onClick={() => setLayout('grid')} 
                className={`p-1.5 rounded-lg transition-colors ${layout === 'grid' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setLayout('list')} 
                className={`p-1.5 rounded-lg transition-colors ${layout === 'list' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="h-12 w-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Searching Catalog...</p>
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map((product) => (
              <div key={product._id} className={layout === 'grid' ? '' : 'bg-white rounded-3xl p-4 border border-slate-100 flex flex-col sm:flex-row gap-6'}>
                {layout === 'grid' ? (
                  <ProductCard 
                    id={product._id}
                    slug={product.slug}
                    name={product.name}
                    material={product.defaultMaterial || 'Premium Quality'}
                    rating={5}
                    price={product.price}
                    image={getImageUrl(product.images?.[0])}
                    size={product.defaultSize}
                    qty={product.defaultQuantity}
                  />
                ) : (
                  <>
                    <div className="h-48 w-48 shrink-0 bg-slate-50 rounded-2xl overflow-hidden relative group">
                        <img src={getImageUrl(product.images?.[0])} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                        <Link href={`/product/${product.slug}`} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-black uppercase">View Product</span>
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{product.name}</h3>
                        <p className="text-slate-500 text-sm font-medium mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-secondary italic">₹{product.price?.toLocaleString()}</span>
                            <Link href={`/product/${product.slug}`} className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">Details</Link>
                        </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-xl max-w-2xl mx-auto mt-12">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="h-12 w-12 text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">No Matches Found</h3>
            <p className="text-slate-500 font-medium mb-10">We couldn't find anything matching "{query}". Try checking your spelling or using more general terms.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/category/all-products" className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-secondary/20 hover:brightness-110 transition-all">Browse All Products</Link>
               <button onClick={() => window.history.back()} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all">Go Back</button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="flex gap-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i + 1);
                    loadProducts(i + 1, sort);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`h-12 w-12 rounded-xl font-black text-sm transition-all ${page === i + 1 ? 'bg-primary text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'} `}
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

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen pt-32 text-center font-bold">Loading...</div>}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
