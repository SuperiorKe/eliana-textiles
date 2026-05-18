import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif tracking-[0.2em] uppercase font-light">
            Eliana
          </h2>
          <p className="text-paper/60 text-sm leading-relaxed max-w-xs">
            Nairobi's premier destination for high-quality duvets, mattresses, and luxury bedding since 2018.
          </p>
          <div className="space-y-2 text-[10px] uppercase tracking-widest text-paper/40">
            <p>OTC Wholesale Mall, Nairobi</p>
            <p>WhatsApp: +254 707 755 277</p>
            <p>Phone: +254 715 556 741</p>
          </div>
          <div className="flex items-center space-x-2 text-paper/40 pt-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-paper/40">Shop</h4>
          <nav aria-label="Shop categories">
            <ul className="space-y-3 text-sm font-medium tracking-wide">
              <li><a href="#" className="hover:text-paper/60 transition-colors">Duvets</a></li>
              <li><a href="#" className="hover:text-paper/60 transition-colors">Bed Sheets</a></li>
              <li><a href="#" className="hover:text-paper/60 transition-colors">Mattresses</a></li>
              <li><a href="#" className="hover:text-paper/60 transition-colors">Pillows</a></li>
              <li><a href="#" className="hover:text-paper/60 transition-colors">New Arrivals</a></li>
            </ul>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-paper/40">Support</h4>
          <nav aria-label="Support links">
            <ul className="space-y-3 text-sm font-medium tracking-wide">
              <li><a href="#" className="hover:text-paper/60 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-paper/60 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-paper/60 transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-paper/60 transition-colors">Care Instructions</a></li>
              <li><a href="#" className="hover:text-paper/60 transition-colors">FAQ</a></li>
            </ul>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-paper/40">Newsletter</h4>
          <p className="text-paper/60 text-xs">Join our list for exclusive releases and design stories.</p>
          <div className="relative">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="w-full bg-transparent border-b border-paper/20 py-3 text-xs tracking-widest focus:outline-none focus:border-paper transition-colors pr-14"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-paper transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-paper/10 flex flex-col md:flex-row justify-between text-[10px] uppercase tracking-[0.2em] text-paper/30 space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} ELIANA TEXTILES. ALL RIGHTS RESERVED.</p>
        <div className="flex space-x-8">
          <a href="#" className="hover:text-paper/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-paper/60 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
