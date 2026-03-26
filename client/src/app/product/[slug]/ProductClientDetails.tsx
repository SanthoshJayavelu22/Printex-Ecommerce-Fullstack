"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Star, ClipboardList, PenTool, CalendarSearch, CheckCircle2, Plus, Package, Send, Download, ShoppingBag, Loader2, Heart, Trash2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useAlertModal } from "@/contexts/ModalContext";
import DesignUploadModal from "@/components/DesignUploadModal";
import MaterialSelector from "@/components/MaterialSelector";
import { fetchApi, getImageUrl } from "@/lib/api";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductClientDetails({ product }: { product: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || "");
  const [showFaq, setShowFaq] = useState(false);
  const [showHowTo, setShowHowTo] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const { showAlert } = useAlertModal();


  // Form selections matching defaults
  const [shape, setShape] = useState(product.defaultShape || "Round");
  const [size, setSize] = useState(product.defaultSize || "2in x 2in");
  const [quantity, setQuantity] = useState(product.defaultQuantity || 100);
  const [material, setMaterial] = useState("");
  const [materialError, setMaterialError] = useState(false);

  // Real review and wishlist state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Price calculation with dynamic volume discounts
  const baseUnitPrice = product.price || 0.95;
  
  // Find the highest applicable discount tier for the current quantity
  const applicableDiscount = (product.quantityDiscounts || [])
    .filter((d: any) => quantity >= d.minQuantity)
    .sort((a: any, b: any) => b.minQuantity - a.minQuantity)[0];

  const discountRate = applicableDiscount ? applicableDiscount.discountPercentage : 0;
  const discountedUnitPrice = baseUnitPrice * (1 - discountRate / 100);
  
  const totalPrice = (discountedUnitPrice * quantity).toFixed(2);
  const unitPrice = discountedUnitPrice.toFixed(2);
  const originalPrice = (baseUnitPrice * quantity).toFixed(2);
  const isDiscounted = discountRate > 0;

  const fetchReviews = async () => {
    try {
      const res = await fetchApi(`/products/${product._id}/reviews`);
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkWishlist = async () => {
    if (!user) return;
    try {
      const res = await fetchApi('/wishlist');
      if (res.success) {
        const found = res.data.products.some((p: any) => p._id === product._id);
        setIsInWishlist(found);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkWishlist();
  }, [product._id, user]);

  const handleToggleWishlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      await fetchApi(`/wishlist/${product._id}`, { method: 'POST' });
      setIsInWishlist(!isInWishlist);
    } catch (err: any) {
      showAlert('Wishlist Error', err.message || "Action failed", 'error');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetchApi(`/products/${product._id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(newReview)
      });
      if (res.success) {
        showAlert('Review Submitted', "Review submitted! It will appear once approved by admin.", 'success');
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (err: any) {
      showAlert('Review Error', err.message || "Failed to submit review", 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCheckoutClick = () => {
    if (!material) {
        setMaterialError(true);
        // Scroll to material selector or just show alert
        showAlert('Selection Required', "Please select a material before proceeding.", 'info');
        return;
    }
    setMaterialError(false);
    setIsModalOpen(true);
  };

  const handleContinueWithDesign = async (designFile: File | null) => {
    setIsModalOpen(false);

    if (!user) {
      const config = {
        productId: product._id,
        quantity,
        selectedSize: size,
        selectedShape: shape,
        selectedMaterial: material,
        selectedFinish: material,
        needsDesign: !designFile
      };
      sessionStorage.setItem('pending_cart_item', JSON.stringify(config));
      router.push(`/login?redirect=/product/${product.slug}`);
      return;
    }

    setPurchaseLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', product._id);
      formData.append('quantity', quantity.toString());
      formData.append('selectedSize', size);
      formData.append('selectedShape', shape);
      formData.append('selectedMaterial', material);
      formData.append('selectedFinish', material);

      if (designFile) {
        formData.append('designFile', designFile);
      } else {
        formData.append('needsDesign', 'true');
      }

      await addToCart(formData);
      router.push('/cart');
    } catch (err: any) {
      showAlert('Cart Error', err.message || 'Failed to add to cart', 'error');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleNextImage = () => {
    if (!product.images || product.images.length <= 1) return;
    const currentIndex = product.images.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % product.images.length;
    setActiveImage(product.images[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!product.images || product.images.length <= 1) return;
    const currentIndex = product.images.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setActiveImage(product.images[prevIndex]);
  };

  useGSAP(() => {
      const sections = gsap.utils.toArray('.ux-anim-section');
      sections.forEach((section: any) => {
          gsap.fromTo(section, 
              { opacity: 0, y: 50 },
              { 
                  opacity: 1, 
                  y: 0, 
                  duration: 1.2, 
                  ease: "power4.out",
                  scrollTrigger: {
                      trigger: section,
                      start: "top 85%",
                      toggleActions: "play none none none"
                  }
              }
          );
      });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pt-44 pb-20 max-w-[1600px] mx-auto px-6 md:px-12 xl:px-24">
      
      {/* Breadcrumbs - Matching Category Page */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-3 mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 active:scale-95">Home</Link>
        {product.categories?.[0] ? (
          <>
            <ChevronRight size={12} className="text-slate-300" />
            <Link href={`/category/${product.categories[0].slug}`} className="hover:text-primary transition-colors active:scale-95">
              {product.categories[0].name}
            </Link>
          </>
        ) : null}
        <ChevronRight size={12} className="text-slate-300" />
        <span className="text-primary truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16 relative">
        {/* Left Side: Images & Info Details */}
        <div className="w-full lg:w-3/5 xl:w-[65%]">
            <div className="flex justify-between items-start gap-6 mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-primary tracking-tighter uppercase leading-[0.9]">
                    {product.name}
                </h1>
                <button 
                    onClick={handleToggleWishlist}
                    className={`shrink-0 w-14 h-14 rounded-full border flex items-center justify-center transition-all shadow-sm ${isInWishlist ? 'bg-pink-50 border-pink-200 text-pink-500' : 'bg-white border-slate-100 text-slate-300 hover:text-secondary hover:border-secondary'}`}
                >
                    <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
                </button>
            </div>
            
            {/* Reviews Under Title */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-[#f7b500]">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} className={i===4 ? "text-slate-300" : ""} />)}
                </div>
                <span className="text-sm font-semibold text-slate-600">4.8/5 ({reviews.length > 0 ? reviews.length : 697} Reviews)</span>
            </div>

            {/* Images Slider Layout */}
            <div className="flex flex-col-reverse md:flex-row gap-4 mb-8">
                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                    <div className=" flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] md:w-24 shrink-0 hide-scrollbar pb-2 md:pb-0 pr-2">
                        {product.images.map((img: string, i: number) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveImage(img)}
                                className={`w-20 h-20 md:w-full md:h-24 shrink-0 rounded-lg border-2 overflow-hidden transition-all ${activeImage === img ? 'border-emerald-600 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover mix-blend-multiply bg-slate-50" />
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Main Image */}
                <div className="flex-1 rounded-xl overflow-hidden relative flex items-center justify-center min-h-[300px] sm:min-h-[420px]">
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-20"
                    >
                        <ChevronLeft size={20} className="text-slate-600"/>
                    </button>
                    {activeImage ? (
                        <img src={getImageUrl(activeImage)} alt={product.name} className="w-[85%] h-[85%] object-contain mix-blend-multiply drop-shadow-sm" />
                    ) : (
                        <div className="text-slate-400">No Image Available</div>
                    )}
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-20"
                    >
                        <ChevronRight size={20} className="text-slate-600"/>
                    </button>
                </div>
            </div>

            {/* Product Meta description text */}
            <p className="text-slate-600 leading-relaxed mb-6 font-medium text-sm sm:text-base">
                {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-12">
               <span className="bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">MOQ 25 pcs</span>
               <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-2"><Package size={14} /> 2-3 Days Delivery</span>
               <span className="bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-2"><PenTool size={14} /> Design Upload & Assistance</span>
            </div>

            {/* 3 Step Process Icons */}
            <div className="ux-anim-section border border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row justify-center items-center gap-16 text-center bg-white mb-16 shadow-premium">
                <div className="flex flex-col items-center max-w-[200px] group">
                    <div className="w-20 h-20 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-700">
                        <ClipboardList size={32} />
                    </div>
                    <h3 className="font-black text-primary mb-3 text-[10px] uppercase tracking-[0.2em]">Order Product</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Select size, quantity & material</p>
                </div>
                <div className="flex flex-col items-center max-w-[200px] group">
                    <div className="w-20 h-20 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-700">
                        <PenTool size={32} />
                    </div>
                    <h3 className="font-black text-primary mb-3 text-[10px] uppercase tracking-[0.2em]">Design Approval</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Approve print via whatsapp / email</p>
                </div>
                <div className="flex flex-col items-center max-w-[200px] group">
                    <div className="w-20 h-20 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-700">
                        <CalendarSearch size={32} />
                    </div>
                    <h3 className="font-black text-primary mb-3 text-[10px] uppercase tracking-[0.2em]">Dispatch</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Fast delivery in 2-3 business days</p>
                </div>
            </div>


             {/* How To Order Accordion */}
             <div className="ux-anim-section border-b border-slate-100 mb-4 bg-white overflow-hidden">
                 <button 
                   onClick={() => setShowHowTo(!showHowTo)} 
                   className="w-full flex items-center justify-between py-10 text-left transition-colors"
                 >
                     <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter">How to Order</h2>
                     {showHowTo ? <ChevronUp size={24} className="text-primary"/> : <ChevronDown size={24} className="text-slate-300"/>}
                 </button>
                 {showHowTo && (
                     <div className="pb-12 text-slate-500 text-base leading-relaxed space-y-10 font-medium">
                         <div className="max-w-3xl">
                             <h3 className="font-black text-primary text-2xl uppercase tracking-tighter mb-6 underline decoration-secondary decoration-4 underline-offset-8">{product.name} | Professional High-Impact Finish</h3>
                             <p>
                                Custom printed address labels from Printix Labels save you significant time while ensuring every envelope, package, and mailer you send has a crisp, professional finish that represents your brand or event perfectly.
                             </p>
                         </div>
                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <li className="space-y-4 p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-xl shadow-primary/20">01</div>
                                <p className="text-primary font-black uppercase tracking-widest text-[10px]">Streamline Process</p>
                                <p className="text-sm font-bold text-slate-400">Say goodbye to the tedious task of handwriting. A stack of pre-printed tags slashes your shipping and mailing process time.</p>
                             </li>
                             <li className="space-y-4 p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center font-black text-xs shadow-xl shadow-secondary/20">02</div>
                                <p className="text-primary font-black uppercase tracking-widest text-[10px]">Professional Appearance</p>
                                <p className="text-sm font-bold text-slate-400">We print your name, logo, and address with sharp clarity on high quality materials, ensuring your brand looks its best.</p>
                             </li>
                             <li className="space-y-4 p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-xl shadow-indigo-500/20">03</div>
                                <p className="text-primary font-black uppercase tracking-widest text-[10px]">Your Design or Ours</p>
                                <p className="text-sm font-bold text-slate-400">Provide your high-resolution design files during checkout, or let our expert team handle the professional design for you at no extra cost.</p>
                             </li>
                         </ul>
                     </div>
                 )}
             </div>

             {/* FAQs Accordion */}
             <div className="ux-anim-section border-b border-slate-100 mb-12 bg-white overflow-hidden">
                 <button 
                   onClick={() => setShowFaq(!showFaq)} 
                   className="w-full flex items-center justify-between py-10 text-left transition-colors"
                 >
                     <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter">FAQs</h2>
                     {showFaq ? <ChevronUp size={24} className="text-primary"/> : <Plus size={24} className="text-slate-300"/>}
                 </button>
                 {showFaq && (
                     <div className="pb-12 text-gray-500 text-lg leading-relaxed flex flex-col gap-8">
                        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                            <p className="font-black text-black uppercase tracking-tight mb-3">Q: Are these waterproof?</p>
                            <p className="text-sm font-medium">A: The standard paper is not waterproof, but you can select our premium thin film material for full water resistance.</p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                            <p className="font-black text-black uppercase tracking-tight mb-3">Q: Do you offer custom shapes?</p>
                            <p className="text-sm font-medium">A: Yes! Simply select "Custom/Any Shape" in the shape dropdown during your configuration.</p>
                        </div>
                     </div>
                 )}
             </div>

             {/* Customer Reviews Section */}
             <div className="ux-anim-section mb-24">
                 <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                      <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-[0.85]">Customer <br/><span className="text-gray-200">Reviews.</span></h2>
                      <div className="flex gap-3">
                          <button 
                            onClick={() => {
                                const skip = (typeof window !== 'undefined' && window.innerWidth >= 768) ? 2 : 1;
                                setReviewPage(prev => Math.max(0, prev - skip));
                            }}
                            disabled={reviewPage === 0}
                            className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                          >
                              <ChevronLeft size={24} />
                          </button>
                          <button 
                            onClick={() => {
                                const total = Math.max(reviews.length, 6);
                                const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
                                const perPage = isDesktop ? 2 : 1;
                                const max = Math.max(0, total - perPage);
                                setReviewPage(prev => Math.min(max, prev + perPage));
                            }} 
                            className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                          >
                              <ChevronRight size={24} />
                          </button>
                      </div>
                 </div>
                 <div className="relative overflow-hidden">
                     <div 
                       className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" 
                       style={{ transform: `translateX(-${reviewPage * (typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 50)}%)` }}
                     >
                          {(reviews.length > 0 ? reviews : [
                             {user: { name: "Rahul Shah" }, rating: 5, comment: "Awesome Service Providers.The sticker quality is super and product delivered the next day what fast service."},
                             {user: { name: "Piyush Verma" }, rating: 5, comment: "They are perfect and mind the material is so super soft print as well, my experience with Kraftix Digital, Quality is just uncompromised so it is standard Papers Stickers."},
                             {user: { name: "Surya Shankar" }, rating: 4, comment: "Had a wonderful experience with over the service, far in small business to make the delivery timeline managed as part requirement was no less you will get definitely best parts. Prime quality keeps safe."},
                             {user: { name: "Anita Desai" }, rating: 5, comment: "Highly recommended for custom branding labels. The team is very professional and the color matching is spot on."},
                             {user: { name: "Vikram Malhotra" }, rating: 5, comment: "Fastest delivery I have ever experienced for custom stickers. The material quality is top-notch."},
                             {user: { name: "Priya Sharma" }, rating: 5, comment: "The holographic effect is stunning! My packaging looks amazing now. Thank you Kraftix!"}
                          ]).map((rev, i) => (
                              <div key={i} className="w-full md:w-1/2 px-4 shrink-0">
                                  <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-700 group h-full">
                                      <div className="flex text-black mb-6">
                                          {[...Array(5)].map((_,k) => <Star key={k} size={16} fill={k < rev.rating ? "currentColor" : "none"} className={k >= rev.rating ? "text-gray-200": ""} />)}
                                      </div>
                                      <p className="text-xl text-gray-500 font-medium leading-relaxed mb-8 group-hover:text-black transition-colors line-clamp-4">{rev.comment}</p>
                                      <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-black text-xs uppercase tracking-widest">{(rev.user?.name || 'A').charAt(0)}</div>
                                          <h4 className="font-black text-black uppercase tracking-tight text-sm">{rev.user?.name || 'Anonymous'}</h4>
                                      </div>
                                  </div>
                              </div>
                          ))}
                     </div>
                 </div>

                 {/* Submit Review Form */}
                 <div className="mt-20 bg-[#FAFAFA] border border-slate-100 rounded-[3rem] p-12">
                     <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-8 italic">Share Your Experience</h3>
                     <form onSubmit={handleSubmitReview} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-4">Your Rating</label>
                            <div className="flex gap-2">
                                {[1,2,3,4,5].map(star => (
                                    <button 
                                        type="button" 
                                        key={star} 
                                        onClick={() => setNewReview({...newReview, rating: star})}
                                        className={`transition-all ${newReview.rating >= star ? 'text-[#f7b500]' : 'text-slate-200'}`}
                                    >
                                        <Star size={32} fill={newReview.rating >= star ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-4">Your Comment</label>
                            <textarea 
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                required
                                placeholder="What did you like about this product?"
                                className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/30 outline-none transition-all min-h-[150px]"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={submittingReview}
                            className="bg-secondary text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-4 hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-secondary/20"
                        >
                            {submittingReview ? 'Submitting...' : <>Post Review <Send size={14}/></>}
                        </button>
                     </form>
                 </div>
             </div>

             {/* Related Products Section */}
             <div className="ux-anim-section mb-24">
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-black uppercase tracking-tighter mb-12">Related <br/><span className="text-gray-200">Items.</span></h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                     {(product.relatedProducts && product.relatedProducts.length > 0 ? product.relatedProducts : [
                         {_id: '1', name: 'Vinyl Die-Cut Stickers', slug: '#', images: ['https://images.unsplash.com/photo-1572375958540-bbfe49cf9330?auto=format&fit=crop&q=80']},
                         {_id: '2', name: 'Packaging Box Sleeves', slug: '#', images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80']},
                         {_id: '3', name: 'Holographic Labels', slug: '#', images: ['https://images.unsplash.com/photo-1544022613-e87ea75a7a1f?auto=format&fit=crop&q=80']}
                     ]).map((rp: any) => (
                         <Link href={rp.slug === '#' ? '#' : `/product/${rp.slug}`} key={rp._id} className="group flex flex-col transition-all duration-700">
                             <div className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] relative overflow-hidden p-12 mb-8 group-hover:shadow-2xl transition-all duration-700">
                                 {rp.images?.[0] ? (
                                     <img src={getImageUrl(rp.images[0])} alt={rp.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-[1.5s]" />
                                 ) : (
                                     <Package className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" />
                                 )}
                                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                                     <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">View Detail</span>
                                 </div>
                             </div>
                             <div className="px-4">
                                 <h4 className="font-black text-black uppercase tracking-tight text-xl mb-1 group-hover:tracking-wider transition-all duration-700">{rp.name}</h4>
                                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic font-bold">Premium Series</p>
                             </div>
                         </Link>
                     ))}
                  </div>
             </div>

             {/* Final CTA Section */}
             <div className="ux-anim-section bg-black rounded-[4rem] p-16 md:p-32 relative overflow-hidden text-center flex flex-col items-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                 <div className="relative z-10">
                     <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 max-w-4xl text-balance">Bring Your Brand <br/> to Life Today.</h2>
                     <p className="text-lg md:text-xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto">Upload your artwork and get a professional print experience with express global shipping.</p>
                     <div className="flex flex-wrap justify-center gap-6">
                        <button className="bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl">Start Your Order</button>
                        <Link href="/contact" className="border border-white/20 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">Talk to Expert</Link>
                     </div>
                 </div>
             </div>
        </div>


        {/* Right Side Sticky Calculator Widget */}
        <div className="w-full lg:w-2/5 xl:w-[35%] relative">
            <div className="lg:sticky lg:top-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col max-h-[calc(100vh-2rem)]">
                 
                 {/* Internal Scrollable Content */}
                 <div className="p-6 md:p-8 flex-1 overflow-y-auto hide-scrollbar">
                     <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                         <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">Get Started</h2>
                     </div>

                     {/* Configuration Form */}
                     <div className="space-y-5">
                         
                         {/* Shape */}
                         <div className="flex items-center justify-between flex-wrap gap-2">
                             <label className="text-sm font-bold text-slate-700 w-1/3">Select Shape</label>
                             <div className="relative flex-1 min-w-[200px]">
                                  <select 
                                      value={shape} 
                                      onChange={(e) => setShape(e.target.value)} 
                                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                                      disabled={product.fixedShape}
                                  >
                                      {product.availableShapes && product.availableShapes.length > 0 ? (
                                          product.availableShapes.map((s: string) => <option key={s} value={s}>{s}</option>)
                                      ) : (
                                          <>
                                              <option value="Round">Round</option>
                                              <option value="Square / Rectangle">Square / Rectangle</option>
                                              <option value="Oval">Oval</option>
                                              <option value="Custom/Any Shape">Custom/Any Shape</option>
                                          </>
                                      )}
                                  </select>
                                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                             </div>
                         </div>

                         {/* Size */}
                         <div className="flex items-center justify-between flex-wrap gap-2">
                             <label className="text-sm font-bold text-slate-700 w-1/3 flex items-center gap-1">
                                Size <span className="text-[10px] w-4 h-4 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 cursor-help" title="Select appropriate size in inches">?</span>
                             </label>
                             <div className="relative flex-1 min-w-[200px]">
                                 <select 
                                     value={size} 
                                     onChange={(e) => setSize(e.target.value)} 
                                     className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                                     disabled={product.fixedSize}
                                 >
                                     {product.availableSizes && product.availableSizes.length > 0 ? (
                                         product.availableSizes.map((s: string) => <option key={s} value={s}>{s}</option>)
                                     ) : (
                                         <>
                                             <option value="2in x 2in">2in x 2in</option>
                                             <option value="3in x 3in">3in x 3in</option>
                                             <option value="4in x 4in">4in x 4in</option>
                                             <option value="Custom Size">Custom Size</option>
                                         </>
                                     )}
                                 </select>
                                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                             </div>
                         </div>

                         {/* Bulk Discount Tiers Table */}
                         {product.quantityDiscounts && product.quantityDiscounts.length > 0 && (
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 animate-in fade-in duration-500 mb-5">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                   <Plus size={10} className="text-primary" /> Volume Discount Tiers
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[...product.quantityDiscounts].sort((a: any, b: any) => a.minQuantity - b.minQuantity).map((tier: any, idx: number) => (
                                        <div 
                                          key={idx} 
                                          className={`flex items-center justify-between px-3 py-2 rounded-xl border-2 transition-all ${
                                            quantity >= tier.minQuantity 
                                              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                                              : 'bg-white border-slate-100 text-slate-600'
                                          }`}
                                        >
                                            <span className="text-[10px] font-black">{tier.minQuantity}+ Units</span>
                                            <span className={`text-[10px] font-black ${quantity >= tier.minQuantity ? 'text-white' : 'text-emerald-500'}`}>{tier.discountPercentage}% OFF</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         )}

                         {/* Quantity */}
                         <div className="flex items-center justify-between flex-wrap gap-2">
                             <label className="text-sm font-bold text-slate-700 w-1/3">Quantity</label>
                             <div className="relative flex-1 min-w-[200px]">
                                 <select 
                                      value={quantity} 
                                      onChange={(e) => setQuantity(Number(e.target.value))} 
                                      className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer text-right pl-12 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                      disabled={product.fixedQuantity}
                                  >
                                      {product.availableQuantities && product.availableQuantities.length > 0 ? (
                                          product.availableQuantities.map((q: number) => <option key={q} value={q}>{q}</option>)
                                      ) : (
                                          <>
                                              <option value={25}>25</option>
                                              <option value={50}>50</option>
                                              <option value={100}>100</option>
                                              <option value={250}>250</option>
                                              <option value={500}>500</option>
                                              <option value={1000}>1000</option>
                                          </>
                                      )}
                                  </select>
                                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                             </div>
                         </div>

                         {/* Material Selection */}
                         <div className="pt-2">
                             <MaterialSelector 
                                selected={material} 
                                onSelect={(val) => {
                                    setMaterial(val);
                                    setMaterialError(false);
                                }} 
                                error={materialError}
                                availableMaterials={product.availableMaterials}
                                disabled={product.fixedMaterial}
                             />
                         </div>

                          {/* Form End */}
                          <div className="h-40" />
                      </div>
                 </div>

                  {/* Sticky Footer: Total & Checkout Button */}
                  <div className="bg-slate-50 border-t border-slate-200 p-6 shadow-[0_-4px_20px_rgb(0,0,0,0.03)] z-10 shrink-0">
                      <div className="flex items-end justify-between mb-4">
                          <div>
                             <span className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-1">
                                Total (GST Incl)
                             </span>
                          </div>
                          <div className="text-right">
                              {isDiscounted ? (
                                <>
                                  <div className="flex items-center justify-end gap-2 mb-1">
                                    <span className="text-[10px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">Save {discountRate}%</span>
                                    <span className="text-sm font-bold text-slate-400 line-through">₹{originalPrice}</span>
                                  </div>
                                  <div className="text-4xl font-black text-black italic">₹{totalPrice}</div>
                                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex flex-col">
                                     <span>Unit: ₹{unitPrice}</span>
                                     <span className="text-emerald-500 font-black">Applied Bulk Discount</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-3xl font-black text-black italic">₹{totalPrice}</div>
                                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Unit: ₹{unitPrice}</div>
                                </>
                              )}
                          </div>
                      </div>
                      <button 
                        onClick={handleCheckoutClick}
                        disabled={purchaseLoading}
                        className="w-full bg-black hover:bg-gray-800 py-6 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
                      >
                          {purchaseLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Checkout Now <ShoppingBag size={14} /></>}
                      </button>
                  </div>
            </div>

           

        </div>

      </div>
      
      <DesignUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onContinue={handleContinueWithDesign} 
        productName={product.name} 
      />
    </div>
  )
}
