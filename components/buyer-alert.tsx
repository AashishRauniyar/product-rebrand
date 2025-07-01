"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Shield } from "lucide-react";
import CounterfeitReplacementModal from "./counterfeit-replacement-modal";

import type { Product } from "@/lib/models/product";

interface BuyerAlertProps {
  product: Product;
}

export default function BuyerAlert({ product }: BuyerAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.1
          }}
          className="w-full max-w-4xl mx-auto mb-6"
        >
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 md:p-6 overflow-hidden animate-focus-pulse">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            
            {/* Shield icon */}
            <div className="absolute top-3 right-3 opacity-60">
              <Shield className="w-5 h-5 text-white" />
            </div>

            <div className="relative">
              {/* Main content */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-yellow-300" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-white font-bold text-sm md:text-base mb-1"
                  >
                    Important: Counterfeit Alert
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-white/90 text-xs md:text-sm leading-relaxed"
                  >
                    Due to popularity, counterfeits exist. We've rebranded to{" "}
                    <span className="font-semibold text-yellow-200">{product?.name}</span>{" "}
                    for your protection.
                  </motion.p>
                </div>
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex-shrink-0"
                >
                  <CounterfeitReplacementModal product={product} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 