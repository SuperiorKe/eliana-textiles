import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface NotificationProps {
  show: boolean;
  message: string;
}

export default function Notification({ show, message }: NotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] bg-ink text-paper px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-paper/10 backdrop-blur-md"
        >
          <div className="bg-paper text-ink rounded-full p-1">
            <Check size={12} strokeWidth={3} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
