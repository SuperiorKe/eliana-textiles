import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale } from "lucide-react";
import { Product } from "../types";
import Breadcrumbs from "./Breadcrumbs";

interface ComparisonModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ products, isOpen, onClose, onRemove }) => {
  if (!isOpen) return null;

  const getRows = () => {
    const keys = ["Material", "Thread Count", "Firmness", "Weight"];
    return keys.map(key => ({
      key,
      values: products.map(p => {
        const attr = p.attributes;
        switch(key) {
          case "Material": return attr?.material || "-";
          case "Thread Count": return attr?.threadCount || "-";
          case "Firmness": return attr?.firmness || "-";
          case "Weight": return attr?.weight || "-";
          default: return "-";
        }
      })
    }));
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 lg:p-12"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-paper w-full max-w-6xl shadow-2xl rounded-sm overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-ink/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Breadcrumbs items={[{ label: "Comparison" }]} />
              <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-full transition-colors -mr-2">
                <X size={24} />
              </button>
            </div>
            <h2 className="font-serif text-3xl uppercase tracking-wide flex items-center gap-3">
              <Scale size={28} /> Product Comparison
            </h2>
          </div>

          <div className="flex-1 overflow-x-auto p-8">
            {products.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-ink/40 space-y-4">
                <Scale size={48} strokeWidth={1} />
                <p className="font-serif italic text-lg">No products selected for comparison.</p>
              </div>
            ) : (
              <div className="min-w-[800px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-1/5 pb-8"></th>
                      {products.map(p => (
                        <th key={p.id} className="w-1/5 pb-8 px-4 text-left group relative">
                          <button 
                            onClick={() => onRemove(p.id)}
                            className="absolute top-0 right-4 p-1 text-ink/20 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                          <div className="aspect-[3/4] bg-[#e8e4df] mb-4">
                            <img src={p.image} className="w-full h-full object-cover" />
                          </div>
                          <h3 className="font-serif text-lg leading-tight">{p.name}</h3>
                          <p className="text-xl font-medium mt-2">KSh {p.price.toLocaleString()}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-ink/5">
                      <td className="py-4 text-xs font-bold uppercase tracking-widest text-ink/40">Category</td>
                      {products.map(p => (
                        <td key={p.id} className="py-4 px-4 text-sm font-medium">{p.category}</td>
                      ))}
                    </tr>
                    {getRows().map(row => (
                      <tr key={row.key} className="border-t border-ink/5">
                        <td className="py-4 text-xs font-bold uppercase tracking-widest text-ink/40">{row.key}</td>
                        {row.values.map((v, i) => (
                          <td key={i} className="py-4 px-4 text-sm font-light text-ink/70">{v}</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t border-ink/5">
                      <td className="py-4 text-xs font-bold uppercase tracking-widest text-ink/40">Rating</td>
                      {products.map(p => {
                        const avg = p.reviews.length > 0 
                          ? (p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1)
                          : "No reviews";
                        return (
                          <td key={p.id} className="py-4 px-4 text-sm font-medium">{avg} {p.reviews.length > 0 && "★"}</td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {products.length > 0 && (
            <div className="p-8 bg-ink/5 flex justify-center">
              <button 
                onClick={onClose}
                className="bg-ink text-paper px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-ink/90 transition-colors"
              >
                Return to Shop
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComparisonModal;
