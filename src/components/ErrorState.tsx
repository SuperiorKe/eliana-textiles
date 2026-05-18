import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center max-w-md mx-auto"
    >
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="text-red-500" size={32} />
      </div>
      <h3 className="font-serif text-2xl mb-3 text-ink">Something went wrong</h3>
      <p className="text-sm text-ink/60 mb-8 leading-relaxed">
        {message || "We encountered an error while trying to load our textile collection. Please check your connection and try again."}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-ink text-paper px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-ink/90 transition-all active:scale-95"
      >
        <RefreshCw size={14} /> Retry loading
      </button>
    </motion.div>
  );
};

export default ErrorState;
