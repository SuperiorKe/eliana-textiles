import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Scale, Loader2 } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import ProductDetails from "./components/ProductDetails";
import ComparisonModal from "./components/ComparisonModal";
import WishlistDrawer from "./components/WishlistDrawer";
import ErrorState from "./components/ErrorState";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import Notification from "./components/Notification";
import { Product, CartItem, Review } from "./types";
import { cn } from "./lib/utils";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        const body = await response.text();
        let message = "Failed to fetch textiles. Please try again.";
        try { message = JSON.parse(body).error ?? message; } catch {}
        throw new Error(message);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch textiles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ["All", "Duvets", "Mattresses", "Bed Sheets", "Accessories"];

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (activeCategory !== "All") {
      result = result.filter((p) => {
        if (activeCategory === "Accessories") {
          return !["Duvets", "Mattresses", "Bed Sheets"].includes(p.category);
        }
        return p.category === activeCategory;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const scored = result.map(p => {
        let score = 0;
        const name = p.name.toLowerCase();
        const category = p.category.toLowerCase();
        
        if (name === query) score += 100;
        else if (name.startsWith(query)) score += 50;
        else if (name.includes(query)) score += 10;
        else if (category.includes(query)) score += 5;
        
        const avgRating = p.reviews.length > 0 
          ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length 
          : 0;
        
        score += avgRating * 2;
        
        return { product: p, score };
      });

      result = scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
    }

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "name-az": return a.name.localeCompare(b.name);
        case "name-za": return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }, [activeCategory, products, sortBy, searchQuery]);

  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const toggleComparison = (product: Product) => {
    setComparisonList((prev) => {
      const isAlreadyAdded = prev.some((p) => p.id === product.id);
      if (isAlreadyAdded) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) return prev; // Limit to 4 for comparison
      return [...prev, product];
    });
  };

  const removeFromComparison = (id: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const { reviews, attributes, ...productWithoutExtras } = product;
      return [...prev, { ...productWithoutExtras, quantity: 1 }];
    });
    
    setNotification({ show: true, message: `Added to Bag` });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    
    // Instead of automatically opening the cart, we now show a notification
    // setIsCartOpen(true); 
  };

  const addReview = (productId: string, reviewData: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    };

    setProducts((prev) => 
      prev.map((p) => 
        p.id === productId ? { ...p, reviews: [newReview, ...p.reviews] } : p
      )
    );

    // Also update selected product if it's the one being reviewed
    if (selectedProduct?.id === productId) {
      setSelectedProduct((prev) => {
        if (!prev) return null;
        return { ...prev, reviews: [newReview, ...prev.reviews] };
      });
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeProduct = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-ink selection:text-paper">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectProduct={setSelectedProduct}
        products={products}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSetCategory={setActiveCategory}
      />
      
      <main>
        <Hero />

        {/* Featured Section */}
        <section id="collections" className="py-24 px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-4 block font-bold">
                {searchQuery ? `Search: "${searchQuery}"` : "The Nairobi Collection"}
              </span>
              <h2 className="text-5xl lg:text-6xl font-serif leading-[1.1] text-slate-800">
                {searchQuery ? "Discovery" : "Elegance for Your"} <span className="italic">{searchQuery ? "Results" : "Sanctuary"}</span>
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 overflow-x-auto pb-4 no-scrollbar">
              <div className="flex space-x-12">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "text-[10px] uppercase tracking-[0.4em] font-bold transition-all relative py-4 whitespace-nowrap min-w-[44px]",
                      activeCategory === cat ? "text-ink after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-ink" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="sm:ml-8 flex items-center gap-4 bg-ink/[0.03] px-4 py-2 rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold whitespace-nowrap">Sort By</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[10px] uppercase tracking-widest font-bold focus:outline-none cursor-pointer text-ink/70"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A-Z</option>
                  <option value="name-za">Name: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-ink/20" size={40} strokeWidth={1.5} />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/40 font-sans">Curating collection...</p>
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={fetchProducts} />
            ) : filteredProducts.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center">
                <div className="w-12 h-px bg-ink/10" />
                <p className="text-sm text-ink/40 font-light italic">No textiles matching "{searchQuery}" were found in our studio.</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-ink pb-1 hover:text-slate-400 hover:border-slate-400 transition-all"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAdd={addToCart}
                      onClick={setSelectedProduct}
                      isComparing={comparisonList.some(p => p.id === product.id)}
                      onToggleComparison={toggleComparison}
                      isWishlisted={wishlist.some(p => p.id === product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* Comparison Floating Bar */}
        <AnimatePresence>
          {comparisonList.length > 0 && !isComparisonOpen && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[105] bg-ink text-paper px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 backdrop-blur-md"
            >
              <div className="flex -space-x-2">
                {comparisonList.map(p => (
                  <div key={p.id} className="w-8 h-8 rounded-full border-2 border-ink overflow-hidden bg-white">
                    <img src={p.image} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="h-4 w-px bg-paper/20" />
              <div className="text-xs uppercase tracking-widest font-bold">
                {comparisonList.length} {comparisonList.length === 1 ? "item" : "items"} to compare
              </div>
              <button 
                onClick={() => setIsComparisonOpen(true)}
                className="bg-paper text-ink text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-white transition-colors"
              >
                Compare Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* ... rest of the file ... */}

        {/* Materials Section */}
        <section id="materials" className="bg-ink text-paper py-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-paper/40 font-bold block">
                Sustainable Origin
              </span>
              <h2 className="text-4xl lg:text-6xl font-serif leading-tight">
                Authentic Kenyan <br />
                <span className="text-paper/40">Craftsmanship</span>
              </h2>
              <p className="text-paper/60 text-lg leading-relaxed max-w-md">
                Located at OTC Wholesale Mall, Nairobi, we specialize in high-quality duvets and orthopedic mattresses designed for the perfect night of rest.
              </p>
              <button className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-bold group py-3">
                Trace our supply chain <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>

            <div className="relative group">
              <div className="aspect-[4/5] overflow-hidden rounded-t-[200px] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1629739884942-8678d136ad62?q=80&w=1974&auto=format&fit=crop" 
                  alt="Textile Detail" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-paper text-ink p-8 rounded-2xl shadow-xl max-w-[200px] border border-ink/5">
                <div className="flex gap-1 mb-2 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-xs font-serif italic mb-2">"The softest sheets I have ever touched."</p>
                <cite className="text-[8px] uppercase tracking-widest text-ink/40 font-bold block">— VOGUE LIVING</cite>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        {/* Stat Billboard — replaces AI slop 3-column grid */}
        <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-b border-ink/10">
          <span className="text-[10px] uppercase tracking-[0.4em] text-ink/30 font-bold block mb-12">
            What makes Eliana different
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10 border-t border-ink/10">
            <div className="pt-10 pb-10 md:pt-0 md:pb-0 md:pr-16">
              <p className="font-serif text-6xl lg:text-7xl text-ink leading-none mb-3">400</p>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/30 mb-5">Thread Count</p>
              <p className="text-sm text-ink/55 leading-relaxed font-light">
                Breathable microscopic fibers regulate temperature for deep REM sleep across every season — no hot nights.
              </p>
            </div>
            <div className="pt-10 pb-10 md:pt-0 md:pb-0 md:px-16">
              <p className="font-serif text-6xl lg:text-7xl text-ink leading-none mb-3">30+</p>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/30 mb-5">Year Lifespan</p>
              <p className="text-sm text-ink/55 leading-relaxed font-light">
                Double-stitched seams and long-staple cotton. Buy once, keep for decades — not seasons.
              </p>
            </div>
            <div className="pt-10 pb-10 md:pt-0 md:pb-0 md:pl-16">
              <p className="font-serif text-6xl lg:text-7xl text-ink leading-none mb-3">100%</p>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/30 mb-5">OEKO-TEX® Certified</p>
              <p className="text-sm text-ink/55 leading-relaxed font-light">
                Plastic-free packaging, no harmful substances. Good for your skin and even better for the planet.
              </p>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        allProducts={products}
        onUpdateQuantity={updateQuantity}
        onRemove={removeProduct}
        onAddToCart={addToCart}
      />

      <ProductDetails 
        product={selectedProduct}
        allProducts={products}
        onClose={() => setSelectedProduct(null)}
        onAddReview={addReview}
        onSelectProduct={setSelectedProduct}
        onAddToCart={addToCart}
        onToggleComparison={toggleComparison}
        isComparing={(id) => comparisonList.some(p => p.id === id)}
        onToggleWishlist={toggleWishlist}
        isWishlisted={(id) => wishlist.some(p => p.id === id)}
      />

      <ComparisonModal 
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        products={comparisonList}
        onRemove={removeFromComparison}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemove={toggleWishlist}
        onMoveToCart={(product) => {
          addToCart(product);
          toggleWishlist(product);
        }}
      />

      <Notification show={notification.show} message={notification.message} />
    </div>
  );
}
