"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { ChevronRight, Filter, ShoppingBag, LayoutGrid, ArrowDownAZ, LayoutList } from "lucide-react";
import ProductCard from "@/components/ProductCard";

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
      // Load tree to find breadcrumbs/subcategories easily, or write a custom endpoint
      const treeRes = await fetchApi("/categories/tree");
      const tree = treeRes.data || [];
      setCategoryTree(tree);
      
      // We could use a specific category by slug endpoint, for now we will flatten the tree to find it
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
      // Ensure backend supports searching products by category slug (implemented in service)
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
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Loading Category...</p>
        </div>
      </div>
    );
  }

  if (!category && !loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Category Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-md">We couldn't find the category you were looking for. It might have been moved or deleted.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-semibold text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <Link href="/shop" className="hover:text-indigo-600 transition-colors">Shop</Link>
          {category?.breadcrumbs?.slice(0, -1).map((crumb: any, idx: number) => (
            <span key={idx} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-slate-300" />
              <Link href={`/category/${crumb.slug}`} className="hover:text-indigo-600 transition-colors">{crumb.name}</Link>
            </span>
          ))}
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-900">{category?.name}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">{category?.name}</h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {category?.description || "Explore our premium selection of products in this category. Crafted with excellence."}
            </p>
          </div>
          
          {category?.image && (
            <div className="relative z-10 shrink-0">
              <div className="h-32 w-32 sm:h-48 sm:w-48 bg-slate-100 rounded-full overflow-hidden shadow-xl ring-4 ring-white border border-slate-100">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Subcategories Pills */}
        {subcategories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-3">
            {subcategories.map(sub => (
              <Link 
                key={sub._id} 
                href={`/category/${sub.slug}`}
                className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md transition-all"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-slate-500 font-medium">Showing <span className="font-bold text-slate-900">{products.length}</span> products</p>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Sort */}
            <div className="relative flex-1 sm:flex-none">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none w-full sm:w-48 bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all cursor-pointer"
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
            
            {/* View Toggle */}
            <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm p-1 shrink-0">
              <button 
                onClick={() => setLayout('grid')} 
                className={`p-1.5 rounded-lg transition-colors ${layout === 'grid' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setLayout('list')} 
                className={`p-1.5 rounded-lg transition-colors ${layout === 'list' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 animate-pulse ${layout === 'list' ? 'flex gap-6 items-center' : ''}`}>
                <div className={`bg-slate-200 rounded-xl ${layout === 'grid' ? 'aspect-square w-full mb-4' : 'h-32 w-32 shrink-0'}`}></div>
                <div className={`${layout === 'list' ? 'flex-1' : ''}`}>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map((product) => (
              layout === 'grid' ? (
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
                />
              ) : (
                <div 
                  key={product._id} 
                  onClick={() => window.location.href = `/product/${product.slug}`}
                  className="group bg-white rounded-3xl p-4 transition-all duration-300 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 flex flex-col sm:flex-row gap-6 items-center cursor-pointer"
                >
                  <div className="relative h-48 w-48 shrink-0 bg-slate-50 rounded-2xl overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300">
                        <ShoppingBag size={48} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 justify-center">
                    <div className="flex gap-2 flex-wrap mb-2">
                      {product.categories?.slice(0,2).map((cat: any) => (
                        <span key={cat._id} className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-500">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium mb-4 line-clamp-2 max-w-2xl">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-xl font-black text-slate-900">₹{product.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500 max-w-md mx-auto">We couldn't find any products in this category at the moment. Please check back later or explore other categories.</p>
          </div>
        )}

        {/* Pagination Loop */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2 bg-white rounded-xl shadow-sm border border-slate-100 p-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-10 w-10 rounded-lg font-bold text-sm transition-all ${page === i + 1 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'} `}
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
