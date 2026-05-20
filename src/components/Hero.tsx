import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Bedding"
            className="w-full h-full object-cover grayscale-[20%]"
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="absolute inset-0 bg-ink z-10 pointer-events-none" 
        />
        <div className="absolute inset-0 bg-ink/30" />
      </div>

      <div className="relative z-10 text-center text-paper px-6 max-w-4xl">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.6em] mb-8 block text-paper/60">
            Nairobi's Destination for Premium Textiles
          </span>
        </motion.div>
        
        <div className="overflow-hidden mb-12">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl lg:text-[7.5rem] font-serif leading-[0.9] font-medium tracking-tighter"
          >
            Luxury Sleep, <br />
            <span className="italic">Refined</span> in Kenya
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-10"
        >
          <button
            className="bg-paper text-ink px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:shadow-lg transition-all duration-300 w-full sm:w-auto cursor-pointer"
            onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Collections
          </button>
          <button
            className="text-paper border-b border-paper/20 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] hover:border-paper transition-all flex items-center gap-2 group cursor-pointer min-h-[44px]"
            onClick={() => document.getElementById('materials')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Our Materials <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Decorative vertical text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <span className="text-[10px] uppercase tracking-[1em] text-paper/40 [writing-mode:vertical-rl] rotate-180">
          ESTABLISHED 2018 • PREMIUM QUALITY
        </span>
      </div>
    </section>
  );
}
