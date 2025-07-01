"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Award } from "lucide-react";
import { Product } from "@/lib/models/product";

interface CtaBoxesProps {
  position?: "top" | "middle" | "bottom";
  product: Product;
}

export default function CtaBoxes({
  position = "bottom",
  product,
}: CtaBoxesProps) {
  const ctaBoxes = {
    top: [
      {
        title: "Limited Time Offer",
        description: "Get 30% off when you order today!",
        icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />,
        buttonText: "CLAIM OFFER",
      },
      {
        title: "Risk-Free Trial",
        description: "60-day money back guarantee",
        icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />,
        buttonText: "TRY RISK-FREE",
      },
    ],
    middle: [
      {
        title: "Proven Results",
        description: "Join thousands of satisfied customers",
        icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />,
        buttonText: "SEE RESULTS",
      },
      {
        title: "Premium Quality",
        description: "Made in FDA registered facility",
        icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />,
        buttonText: "LEARN MORE",
      },
    ],
    bottom: [],
  };

  const boxes = ctaBoxes[position];

  if (boxes.length === 0) return null;

  return (
    <section className="mb-8 md:mb-12">
      <div className="grid sm:grid-cols-2 gap-3 md:gap-6">
        {boxes.map((box, index) => (
          <motion.div
            key={`cta-box-${box.title
              .replace(/\s+/g, "-")
              .toLowerCase()}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`bg-indigo-600 dark:bg-indigo-700 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border border-indigo-500/20 dark:border-indigo-400/30 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="flex items-start gap-2 md:gap-4">
              <div className="p-1.5 md:p-3 bg-white/10 rounded-lg md:rounded-xl backdrop-blur-sm">
                {box.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-xl font-bold text-white mb-0.5 md:mb-1">
                  {box.title}
                </h3>
                <p className="text-white/90 mb-2 md:mb-4 text-xs md:text-base">
                  {box.description}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="relative overflow-hidden group bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 md:py-2 px-2 md:px-4 rounded-lg transition-all duration-300 text-xs md:text-base"
                    onClick={() =>
                      window.open(
                        product?.redirect_link || "#",
                        "_blank",
                      )
                    }
                  >
                    <span className="relative z-10">{box.buttonText}</span>
                    <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
