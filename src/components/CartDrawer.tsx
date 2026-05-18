import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Plus } from "lucide-react";
import { CartItem, Product } from "../types";
import { cn } from "../lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  allProducts: Product[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items, 
  allProducts,
  onUpdateQuantity, 
  onRemove,
  onAddToCart
}: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const upsellProducts = allProducts
    .filter(p => !items.some(item => item.id === p.id))
    .slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-paper z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-ink/10 flex items-center justify-between">
              <h2 id="cart-drawer-title" className="font-serif text-2xl tracking-wide uppercase">Your Bag</h2>
              <button 
                onClick={onClose} 
                aria-label="Close bag"
                className="p-2 hover:bg-ink/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-ink/40 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif italic">Your bag is currently empty.</p>
                  <button 
                    onClick={onClose}
                    className="text-xs uppercase tracking-widest text-ink italic border-b border-ink/20"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 aspect-[3/4] bg-[#e8e4df] flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg">{item.name}</h3>
                          <button 
                            onClick={() => onRemove(item.id)} 
                            aria-label={`Remove ${item.name} from bag`}
                            className="text-ink/30 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-ink/40 uppercase tracking-widest">{item.category}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-ink/10">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label={`Decrease quantity for ${item.name}`}
                            className="px-2 py-1 hover:bg-ink/5 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm" aria-label="Quantity">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label={`Increase quantity for ${item.name}`}
                            className="px-2 py-1 hover:bg-ink/5 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Upsell Section */}
              {upsellProducts.length > 0 && (
                <div className="pt-12 border-t border-ink/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/40">Complete your Collection</h4>
                  </div>
                  <div className="space-y-4">
                    {upsellProducts.map((p) => (
                      <div key={p.id} className="flex items-center gap-4 group">
                        <div className="w-16 h-20 bg-ink/[0.03] overflow-hidden flex-shrink-0">
                          <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-xs font-serif">{p.name}</h5>
                          <p className="text-[10px] text-ink/40 tracking-wider">KSh {p.price.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => onAddToCart(p)}
                          className="p-2 border border-ink/10 text-ink/40 hover:text-ink hover:border-ink transition-all rounded-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-ink/10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm uppercase tracking-widest text-ink/50 font-medium">Subtotal</span>
                <span className="text-2xl font-serif tracking-tighter">KSh {total.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-ink/40 uppercase text-center tracking-widest">
                Shipping and taxes calculated at checkout
              </p>
              {(() => {
                const lines = items.map(
                  (item) => `• ${item.name} x${item.quantity} — KSh ${(item.price * item.quantity).toLocaleString()}`
                ).join('%0A');
                const msg = `Hello Eliana Textiles!%0A%0AI'd like to order:%0A${lines}%0A%0ATotal: KSh ${total.toLocaleString()}`;
                const href = items.length > 0 ? `https://wa.me/254715035359?text=${msg}` : undefined;
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "block w-full text-center bg-ink text-paper py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors",
                      items.length > 0 ? "hover:bg-ink/90" : "opacity-30 pointer-events-none"
                    )}
                  >
                    Order via WhatsApp
                  </a>
                );
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
