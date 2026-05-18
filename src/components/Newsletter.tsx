import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-32 px-6 lg:px-12 bg-[#e8e4df]/30 border-y border-ink/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 text-ink/40"
          >
            <Mail size={16} />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">The Collective</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-serif leading-tight"
          >
            Get the Latest <br />
            <span className="italic">Studio Drops</span> in Nairobi
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-ink/60 leading-relaxed font-light italic"
          >
            Join our collective for first access to new container arrivals, wholesale deals, and limited bedroom essentials.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          {subscribed ? (
            <div className="bg-paper p-12 border border-ink/5 text-center space-y-4">
              <span className="text-3xl">✦</span>
              <h3 className="font-serif text-2xl uppercase tracking-tighter">Welcome to the Studio</h3>
              <p className="text-xs text-ink/40 tracking-widest uppercase">Check your inbox for our introductory journal.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Studio@Email.com"
                  className="w-full bg-paper px-6 py-6 border border-ink/10 focus:outline-none focus:border-ink/30 text-sm uppercase tracking-widest placeholder:text-ink/20 transition-all font-light"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-ink text-paper p-4 hover:bg-ink/90 transition-all group-hover:px-6"
                >
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <p className="text-[9px] text-ink/30 uppercase tracking-[0.2em] leading-relaxed text-center italic">
                By entering the collective, you agree to our terms of privacy and waitlist conditions.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
