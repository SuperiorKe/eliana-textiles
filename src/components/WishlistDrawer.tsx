import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { Product } from "../types";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onMoveToCart 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wishlist-drawer-title"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-paper shadow-2xl z-[120] flex flex-col"
          >
            <div className="p-8 flex items-center justify-between border-b border-ink/5">
              <div className="flex items-center gap-3">
                <Heart size={20} className="text-ink/40" aria-hidden="true" />
                <h2 id="wishlist-drawer-title" className="font-serif text-xl tracking-tight">Your Selection</h2>
                <span className="text-[10px] bg-ink/5 px-2 py-1 font-bold text-ink/40 rounded-full" aria-label={`${items.length} items`}>
                  {items.length}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close wishlist"
                className="p-2 hover:bg-ink/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center">
                    <Heart size={24} strokeWidth={1} className="text-ink/20" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif italic text-lg text-ink/60">Your wishlist is empty</p>
                    <p className="text-[10px] uppercase tracking-widest text-ink/30 px-12">
                      SAVE YOUR FAVORITE TEXTILES FOR LATER. THEY WILL APPEAR HERE.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-widest font-bold text-ink border-b border-ink pb-1 hover:text-ink/60 hover:border-ink/60 transition-all"
                  >
                    CONTINUE EXPLORING
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-6 group"
                    >
                      <div className="w-24 h-32 bg-[#e8e4df] overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" 
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-serif text-base leading-tight group-hover:italic transition-all">
                              {item.name}
                            </h3>
                            <p className="text-[10px] uppercase tracking-widest text-ink/40 mt-1">
                              {item.category}
                            </p>
                          </div>
                          <p className="font-medium">KSh {item.price.toLocaleString()}</p>
                        </div>
                        
                        <div className="mt-auto flex items-center gap-4">
                          <button
                            onClick={() => onMoveToCart(item)}
                            className="flex-1 flex items-center justify-center gap-2 bg-ink text-paper text-[9px] uppercase tracking-widest font-bold py-3 hover:bg-ink/90 transition-colors"
                          >
                            <ShoppingBag size={12} /> Add to Bag
                          </button>
                          <button
                            onClick={() => onRemove(item)}
                            className="p-3 border border-ink/10 text-ink/40 hover:text-ink hover:border-ink transition-all"
                            title="Remove item"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-ink/5 bg-ink/[0.02]">
                <button
                  onClick={onClose}
                  className="w-full border border-ink py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-ink hover:text-paper transition-all"
                >
                  Return to Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
