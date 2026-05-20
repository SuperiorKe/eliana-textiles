import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MessageSquare, Send, Info, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Product, Review } from "../types";
import { cn } from "../lib/utils";
import Breadcrumbs from "./Breadcrumbs";
import ProductCard from "./ProductCard";

interface ProductDetailsProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onAddReview: (productId: string, review: Omit<Review, "id" | "date">) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleComparison: (product: Product) => void;
  isComparing: (id: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  allProducts,
  onClose, 
  onAddReview,
  onSelectProduct,
  onAddToCart,
  onToggleComparison,
  isComparing,
  onToggleWishlist,
  isWishlisted
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const averageRating = product.reviews.length > 0
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : "N/A";

  const attributes = [
    { label: "Material", value: product.attributes?.material },
    { label: "Thread Count", value: product.attributes?.threadCount },
    { label: "Firmness", value: product.attributes?.firmness },
    { label: "Weight", value: product.attributes?.weight },
  ].filter(attr => attr.value);

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;
    onAddReview(product.id, { userName, rating, comment });
    setComment("");
    setUserName("");
    setRating(5);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-12"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-title"
          className="bg-paper w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl rounded-sm flex flex-col lg:flex-row"
        >
          {/* Image Side */}
          <div className="lg:w-1/2 h-64 sm:h-80 lg:h-auto flex-shrink-0 bg-[#e8e4df] relative group overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex}
                src={images[currentImageIndex]} 
                alt={product.name} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-paper/20 backdrop-blur-sm text-ink hover:bg-paper/80 transition-all opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 focus:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-paper/20 backdrop-blur-sm text-ink hover:bg-paper/80 transition-all opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 focus:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                      aria-label={`Go to image ${i + 1}`}
                      aria-selected={currentImageIndex === i}
                      role="tab"
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        currentImageIndex === i ? "bg-ink scale-125" : "bg-ink/20"
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            <button
              onClick={onClose}
              aria-label="Close details"
              className="absolute top-4 left-4 p-2 bg-paper/80 backdrop-blur rounded-full lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2 flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="p-8 pb-4 border-b border-ink/5 flex flex-col gap-6 relative">
              <div className="flex justify-between items-start">
                <Breadcrumbs 
                  items={[
                    { label: product.category },
                    { label: product.name }
                  ]} 
                />
                <button 
                  onClick={onClose}
                  aria-label="Close details"
                  className="hidden lg:block p-2 hover:bg-ink/5 rounded-full transition-colors -mr-2 -mt-2"
                >
                  <X size={24} />
                </button>
              </div>
              <div>
                <h2 id="product-title" className="text-3xl font-serif mb-2">{product.name}</h2>
                <div className="flex items-center gap-4">
                   <div className="flex items-center text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} 
                        className={i < Math.round(Number(averageRating)) ? "" : "text-ink/20"}
                      />
                    ))}
                    <span className="ml-2 text-xs font-bold text-ink/80">{averageRating}</span>
                  </div>
                  <span className="text-xs text-ink/40 uppercase tracking-widest">{product.reviews.length} Reviews</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {/* Description Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <Info size={16} /> Product Details
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed font-light italic">
                  {product.description}
                </p>
                
                {attributes.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {attributes.map((attr) => (
                      <div key={attr.label} className="bg-ink/[0.03] p-3 rounded-sm">
                        <span className="text-[9px] uppercase tracking-widest text-ink/30 block mb-1">
                          {attr.label}
                        </span>
                        <span className="text-xs font-medium text-ink/80">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="space-y-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={16} /> Guest Reviews
                </h3>

                <div className="space-y-6">
                  {product.reviews.length === 0 ? (
                    <p className="text-sm italic text-ink/40">No reviews yet. Be the first to share your experience.</p>
                  ) : (
                    product.reviews.map((review) => (
                      <div key={review.id} className="space-y-2 border-b border-ink/5 pb-6 last:border-0">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold uppercase tracking-widest">{review.userName}</span>
                          <span className="text-ink/40">{review.date}</span>
                        </div>
                        <div className="flex text-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <p className="text-sm text-ink/70 leading-relaxed font-light">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Leave a Review */}
              <div className="pt-8 border-t border-ink/10">
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">Leave a Review</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs uppercase tracking-widest text-ink/40">Your Rating</span>
                    <div className="flex gap-1" role="radiogroup" aria-label="Review rating">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          role="radio"
                          aria-checked={rating === s}
                          aria-label={`${s} stars`}
                          className={cn(
                            "transition-colors focus:scale-110",
                            s <= rating ? "text-gold" : "text-ink/20"
                          )}
                        >
                          <Star size={20} fill={s <= rating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
 
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    aria-label="Your name"
                    className="w-full bg-transparent border-b border-ink/10 py-3 text-xs tracking-widest focus:outline-none focus:border-ink transition-colors placeholder:text-ink/30"
                    required
                  />
 
                  <div className="relative">
                    <textarea
                      placeholder="TELL US ABOUT YOUR EXPERIENCE"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      aria-label="Your review comment"
                      rows={3}
                      className="w-full bg-transparent border-b border-ink/10 py-3 text-xs tracking-widest focus:outline-none focus:border-ink transition-colors resize-none placeholder:text-ink/30"
                      required
                    />
                    <button 
                      type="submit"
                      aria-label="Submit review"
                      className="absolute right-0 bottom-3 text-ink/40 hover:text-ink transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Related Products Section */}
              {relatedProducts.length > 0 && (
                <div className="pt-12 border-t border-ink/10 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                      <Sparkles size={16} /> You Might Also Like
                    </h3>
                    <span className="text-[10px] text-ink/40 uppercase tracking-widest">
                      More from {product.category}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {relatedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onAdd={onAddToCart}
                        onClick={(prod) => {
                          onSelectProduct(prod);
                          setCurrentImageIndex(0); // Reset image index for the new product
                        }}
                        isComparing={isComparing(p.id)}
                        onToggleComparison={onToggleComparison}
                        isWishlisted={isWishlisted(p.id)}
                        onToggleWishlist={onToggleWishlist}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-ink text-paper flex justify-between items-center sm:sticky sm:bottom-0 z-10">
              <span className="text-2xl font-serif">KSh {product.price.toLocaleString()}</span>
              <button 
                onClick={() => onAddToCart(product)}
                className="text-xs font-bold uppercase tracking-[0.3em] bg-paper text-ink px-8 py-3 hover:bg-white transition-colors"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetails;
