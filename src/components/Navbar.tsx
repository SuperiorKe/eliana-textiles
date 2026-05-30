import { useState, useEffect, useRef, useMemo } from "react";
import { ShoppingBag, Search, Menu, X, ArrowRight, Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Product } from "../types";
import { WHATSAPP_BASE_URL } from "../constants";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSetCategory?: (category: string) => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onSelectProduct,
  products,
  searchQuery,
  setSearchQuery,
  onSetCategory,
}: NavbarProps) {
  const scrollTo = (id: string) => {
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const scored = products.map(p => {
      let score = 0;
      const name = p.name.toLowerCase();
      
      if (name === query) score += 100;
      else if (name.startsWith(query)) score += 50;
      else if (name.includes(query)) score += 10;
      
      if (score > 0) {
        const avgRating = p.reviews.length > 0
          ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
          : 0;
        score += avgRating * 2;
      }
      return { product: p, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product)
      .slice(0, 5);
  }, [searchQuery, products]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-12 py-6",
        isScrolled || isSearchOpen ? "glossy py-4" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="hidden lg:flex items-center space-x-10 text-[10px] font-bold uppercase tracking-[0.3em] text-ink/50" aria-label="Main navigation">
          <ul className="flex items-center space-x-10">
            <li><a href="#" className="text-ink relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-ink transition-colors min-h-[44px] inline-flex items-center">Home</a></li>
            <li><a href="#" className="hover:text-ink transition-colors min-h-[44px] inline-flex items-center">Collections</a></li>
            <li><a href="#" className="hover:text-ink transition-colors min-h-[44px] inline-flex items-center">The Studio</a></li>
            <li><a href="#" className="hover:text-ink transition-colors min-h-[44px] inline-flex items-center">About</a></li>
          </ul>
        </nav>

        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <a href="/" className="text-2xl lg:text-3xl font-serif tracking-tight uppercase font-semibold italic flex items-center min-h-[44px]">
            Eliana
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative" ref={searchRef}>
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center"
                >
                  <input
                    autoFocus
                    type="text"
                    placeholder="SEARCH OUR COLLECTIONS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search collections"
                    className="w-full bg-transparent border-b border-ink py-1 text-[10px] uppercase tracking-widest focus:outline-none placeholder:text-ink/30"
                  />
                  <button 
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                    className="ml-2 text-ink/50 hover:text-ink"
                    aria-label="Close search"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-ink/70 hover:text-ink transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Open search"
                  aria-expanded={isSearchOpen}
                >
                  <Search size={20} />
                </button>
              )}
            </AnimatePresence>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchOpen && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-4 right-0 w-[400px] bg-white shadow-2xl rounded-sm p-6 space-y-6 z-[60]"
                >
                  <div className="space-y-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-ink/30">Suggestions</span>
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 w-full text-left group"
                      >
                        <div className="w-12 h-16 bg-slate-100 flex-shrink-0 overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-sm group-hover:italic transition-all">{product.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-ink/40">KSh {product.price.toLocaleString()}</p>
                        </div>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-ink/40" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={onOpenWishlist}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-ink/70 hover:text-ink transition-colors relative"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-ink text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenCart}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-ink/70 hover:text-ink transition-colors relative"
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-ink text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>
          <a
            href="{WHATSAPP_BASE_URL}"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center justify-center min-w-[44px] min-h-[44px] text-ink/60 hover:text-ink transition-colors"
            aria-label="Order via WhatsApp"
          >
            <MessageCircle size={20} strokeWidth={1.5} />
          </a>
          <button
            className="lg:hidden text-ink"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-paper border-b border-ink/10 p-6 lg:hidden flex flex-col text-center font-serif text-xl"
          >
            {([
              { label: 'Shop All', category: 'All' },
              { label: 'Duvets', category: 'Duvets' },
              { label: 'Mattresses', category: 'Mattresses' },
              { label: 'Bed Sheets', category: 'Bed Sheets' },
            ] as const).map(({ label, category }) => (
              <a
                key={category}
                href="#collections"
                className="min-h-[52px] flex items-center justify-center hover:italic transition-all border-b border-ink/5"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  onSetCategory?.(category);
                  scrollTo('collections');
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="#materials"
              className="min-h-[52px] flex items-center justify-center hover:italic transition-all border-b border-ink/5"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                scrollTo('materials');
              }}
            >
              Our Story
            </a>
            <a
              href="{WHATSAPP_BASE_URL}"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.3em] font-bold text-paper bg-ink py-4 px-6 min-h-[52px]"
            >
              <MessageCircle size={15} strokeWidth={1.5} />
              Order via WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
