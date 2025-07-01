"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/lib/models/product";

interface NewCtaProps {
  product: Product;
}

export default function NewCta({ product }: NewCtaProps) {
  return (
    <section className="mb-12 md:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="backdrop-blur-sm bg-gradient-to-r from-indigo-700 to-indigo-600 dark:from-indigo-800 dark:to-indigo-700 border border-indigo-500/50 dark:border-indigo-400/50 rounded-xl md:rounded-3xl p-6 md:p-12 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] relative"
      >
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full filter blur-[100px] opacity-20 dark:opacity-30"></div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 drop-shadow-md">
              Experience{" "}
              <span className="text-yellow-300 font-extrabold">
                {product?.name.toUpperCase()}
              </span>
            </h2>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mt-0.5 mr-2 md:mr-3">
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <p className="text-white/95 drop-shadow-sm text-xs md:text-base">
                  <span className="font-bold text-white">
                    Premium Quality Formula
                  </span>{" "}
                  - Made in FDA registered facility with 100% natural
                  ingredients
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mt-0.5 mr-2 md:mr-3">
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <p className="text-white/95 drop-shadow-sm text-xs md:text-base">
                  <span className="font-bold text-white">Proven Results</span> -
                  Thousands of satisfied customers report significant
                  improvements
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mt-0.5 mr-2 md:mr-3">
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <p className="text-white/95 drop-shadow-sm text-xs md:text-base">
                  <span className="font-bold text-white">
                    Risk-Free Guarantee
                  </span>{" "}
                  - {product?.money_back_days}-day money back guarantee if
                  you're not completely satisfied
                </p>
              </div>
            </div>

            <div className="bg-indigo-600 dark:bg-indigo-700 p-3 md:p-4 rounded-lg md:rounded-xl mb-4 md:mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 font-bold drop-shadow-sm text-sm md:text-base">
                    LIMITED TIME OFFER
                  </p>
                  <p className="text-white text-xs md:text-sm drop-shadow-sm">
                    Order now and save up to $600
                  </p>
                </div>
                <div className="bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg px-2 py-1 md:px-3 md:py-1 font-bold text-xs md:text-base">
                  30% OFF
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                className="w-full relative overflow-hidden group bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-sm md:text-lg py-4 md:py-6 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-900/30 border border-yellow-400/20"
                onClick={() => window.open(product?.redirect_link)}
              >
                <span className="relative z-10 font-bold tracking-wider text-black flex items-center text-base md:text-lg">
                  ORDER NOW{" "}
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </span>
                <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              </Button>
            </motion.div>
          </div>

          <div className="flex justify-center mt-6 md:mt-0">
            <div className="relative">
              {/* Responsive bottle size */}
              <div className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-72 md:h-96">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-indigo-700/20 rounded-full filter blur-[60px] opacity-70"></div>
                <Image
                  src={product?.product_image || "/images/placeholder.png"}
                  alt={product?.name + " Product"}
                  fill
                  className="object-contain z-10"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 z-20">
                <Image
                  src={product?.product_badge || "/images/new-badge.png"}
                  alt="New Product Badge"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
