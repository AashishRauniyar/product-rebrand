"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import type { Product } from "@/lib/models/product";

interface ProductFeaturesProps {
  product: Product;
}

export default function ProductFeatures({ product }: ProductFeaturesProps) {
  return (
    <section className="mb-12 md:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true, amount: 0.1 }}
        className="backdrop-blur-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl md:rounded-3xl p-6 md:p-12 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] relative"
      >
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full filter blur-[100px] opacity-10 dark-theme:opacity-20 light-theme:opacity-5"></div>

        <div className="relative">
          <div className="flex items-center justify-center mb-6 md:mb-10">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full max-w-xs hidden md:block dark:via-indigo-400"></div>
            {/* Responsive text size */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[var(--text-primary)] mx-0 md:mx-6 whitespace-normal md:whitespace-nowrap">
              The {product?.name} Difference
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full max-w-xs hidden md:block dark:via-indigo-400"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                viewport={{ once: true, amount: 0.1 }}
                className="space-y-3 md:space-y-6"
              >
                <h3 className="text-lg md:text-2xl font-bold text-[var(--feature-title)]">
                  Premium Quality Formula
                </h3>
                <p className="text-sm md:text-lg text-[var(--text-secondary)]">
                  {product?.name} is manufactured in state-of-the-art facilities
                  under strict quality control standards. Our formula has been
                  perfected over years of research to deliver maximum results
                  with no side effects.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-xs md:text-base">
                      FDA Registered Facility
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-xs md:text-base">
                      GMP Certified Manufacturing
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-xs md:text-base">
                      Third-Party Tested for Purity
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-xs md:text-base">
                      Made in the USA
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>

            <div className="relative order-1 md:order-2 flex justify-center mb-6 md:mb-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true, amount: 0.1 }}
                className="relative"
              >
                {/* Responsive bottle size */}
                <div className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-72 md:h-96">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-indigo-700/20 rounded-full filter blur-[60px] opacity-70 dark-theme:opacity-70 light-theme:opacity-40"></div>
                  <Image
                    src={product?.product_image || "/placeholder.svg"}
                    alt="Product Image"
                    fill
                    className="object-contain z-10"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
