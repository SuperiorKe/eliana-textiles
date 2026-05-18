import { motion } from "framer-motion";
import { Plus, Star, Scale, Heart, Loader2 } from "lucide-react";
import { Product } from "../types";
import React, { useState } from "react";
import { cn } from "../lib/utils";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onClick: (product: Product) => void;
  isComparing: boolean;
  onToggleComparison: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAdd, 
  onClick, 
  isComparing, 
  onToggleComparison,
  isWishlisted,
  onToggleWishlist
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const averageRating = product.reviews.length > 0
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer focus-within:ring-2 focus-within:ring-ink focus-within:ring-offset-4 rounded-sm"
      onClick={() => onClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(product);
        }
      }}
      aria-label={`View details for ${product.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink/[0.03] mb-4">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-ink/10" size={20} strokeWidth={1} />
          </div>
        )}
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-300" />
        
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="bg-paper text-ink p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-ink hover:text-paper focus:opacity-100 focus:translate-y-0"
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus size={20} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComparison(product);
            }}
            className={cn(
              "p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg delay-75 backdrop-blur focus:opacity-100 focus:translate-y-0",
              isComparing ? "bg-ink text-paper" : "bg-paper/80 text-ink hover:bg-paper"
            )}
            aria-label={isComparing ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
            title="Compare Product"
          >
            <Scale size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={cn(
              "p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 shadow-lg delay-150 backdrop-blur focus:opacity-100 focus:translate-y-0",
              isWishlisted ? "bg-red-50 text-red-500" : "bg-paper/80 text-ink hover:bg-paper"
            )}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            title="Save to Wishlist"
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest bg-paper/80 backdrop-blur px-2 py-1 text-ink/60 self-start">
            {product.category}
          </span>
          {averageRating && (
            <div className="text-[10px] flex items-center gap-1 bg-ink/80 text-paper px-2 py-1 backdrop-blur self-start">
              <Star size={8} fill="currentColor" /> {averageRating}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-serif text-xl mb-1">{product.name}</h3>
          <p className="text-xs text-ink/50 uppercase tracking-wider">{product.description}</p>
        </div>
        <span className="font-medium text-ink/80">KSh {product.price.toLocaleString()}</span>
      </div>
    </motion.div>
  );
};

export default ProductCard;
