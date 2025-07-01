"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Clock, Package } from "lucide-react";


interface PricingSectionProps {
  productName: string;
  moneyBackDays: number;
  redirectLink: string;
}

export default function PricingSection({
  productName,
  moneyBackDays,
  redirectLink,
}: PricingSectionProps) {
  return (
    <section className="mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="backdrop-blur-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 md:p-12 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] relative"
      >
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 rounded-full filter blur-[100px] opacity-10 dark-theme:opacity-20 light-theme:opacity-5"></div>

        <div className="relative">
          {/* Header banner */}
          <div className="bg-indigo-600 dark:bg-indigo-700 -mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-8 md:mb-10 p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Claim Your Discounted Tribal Force X
            </h2>
            <p className="text-xl md:text-2xl font-bold text-white mb-4">
              Below While Stock Lasts
            </p>
            <div className="text-3xl md:text-5xl font-bold text-yellow-300">
              30:00
            </div>
          </div>

          {/* Status bar */}
          <div className="bg-indigo-700 dark:bg-indigo-800 -mx-8 md:-mx-12 p-3 md:p-4 mb-8 md:mb-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 dark:bg-purple-400 rounded-full mr-2"></div>
              <span className="text-sm md:text-base font-medium">
                Sale Status: Live
              </span>
            </div>
            <div className="hidden md:block">|</div>
            <div className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base font-medium">
                Quantity Remaining: 172
              </span>
            </div>
            <div className="hidden md:block">|</div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base font-medium">
                Spot Reserved For: 30:00
              </span>
            </div>
          </div>

          {/* Free shipping banner */}
          <div className="border border-indigo-500 dark:border-indigo-400 rounded-xl p-4 mb-10 flex items-center justify-center bg-white/5 backdrop-blur-sm">
            <div className="flex-shrink-0 mr-4">
              <Image
                src="/red-truck-free-shipping.png"
                alt="Free Shipping"
                width={100}
                height={60}
              />
            </div>
            <div>
              <p className="text-base md:text-lg">
                Enjoy{" "}
                <span className="text-indigo-500 dark:text-indigo-400 font-bold">
                  FREE SHIPPING
                </span>{" "}
                on 3 and 6-Bottle Orders!
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                *For long-term results, we recommend choosing the 6 bottle
                option
              </p>
            </div>
          </div>

          {/* Pricing options */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* 1 Bottle Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 md:p-6 bg-white/5 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="text-center mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  1 BOTTLE
                </h3>
                <p className="text-lg font-medium">30 DAY SUPPLY</p>
              </div>

              <div className="flex justify-center mb-4 relative">
                <div className="absolute top-0 right-0 bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center transform rotate-12 shadow-lg">
                  <div className="text-center">
                    <p className="text-xs font-bold">SAVE</p>
                    <p className="text-sm font-bold">$80</p>
                  </div>
                </div>
                <Image
                  src="/images/TRIBAL_FORCE_X.png"
                  alt="1 Bottle of Tribal Force X"
                  width={150}
                  height={200}
                  className="object-contain"
                />
              </div>

              <div className="text-center mb-4">
                <p className="text-5xl font-bold">$69</p>
                <p className="text-lg text-[var(--text-secondary)]">/ bottle</p>
              </div>

              <Button
                className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 dark:from-indigo-400 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-600 text-base py-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-900/30 border border-indigo-400/20"
                onClick={() =>
                  window.open(
                    "https://thetribalforcex.com/start/index.php?aff_id=12683&subid=renamelander"
                  )
                }
              >
                <span className="relative z-10 font-bold tracking-wider text-white">
                  BUY NOW
                </span>
                <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              </Button>
            </motion.div>

            {/* 6 Bottle Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
              className="border-2 border-indigo-500 dark:border-indigo-400 rounded-xl p-4 md:p-6 bg-yellow-50/90 dark:bg-indigo-900/50 backdrop-blur-sm relative overflow-hidden transform scale-105 shadow-xl"
            >
              <div className="absolute -top-1 -right-1 w-24 h-24">
                <div className="absolute transform rotate-45 bg-indigo-500 dark:bg-indigo-400 text-white text-xs font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  BEST VALUE
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  6 BOTTLES
                </h3>
                <p className="text-lg font-medium">180 DAY SUPPLY</p>
              </div>

              <div className="flex justify-center mb-4 relative">
                <div className="absolute top-0 right-0 bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center transform rotate-12 shadow-lg">
                  <div className="text-center">
                    <p className="text-xs font-bold">SAVE</p>
                    <p className="text-sm font-bold">$600</p>
                  </div>
                </div>
                <Image
                  src="/supplement-bottles.png"
                  alt="6 Bottles of Tribal Force X"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              <div className="text-center mb-4">
                <p className="text-5xl font-bold">$49</p>
                <p className="text-lg text-[var(--text-secondary)]">/ bottle</p>
              </div>

              <Button
                className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 dark:from-indigo-400 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-600 text-base py-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-900/30 border border-indigo-400/20"
                onClick={() =>
                  window.open(
                    "https://thetribalforcex.com/start/index.php?aff_id=12683&subid=renamelander"
                  )
                }
              >
                <span className="relative z-10 font-bold tracking-wider text-white">
                  BUY NOW
                </span>
                <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              </Button>

              <div className="mt-4 space-y-2">
                <div className="bg-indigo-600 dark:bg-indigo-700 rounded-lg p-2 text-center text-white text-sm font-bold">
                  BIGGEST DISCOUNT
                </div>
                <div className="bg-purple-600 dark:bg-purple-700 rounded-lg p-2 text-center text-white text-sm font-bold">
                  2 FREE BONUSES!
                </div>
                <div className="bg-blue-500 dark:bg-blue-600 rounded-lg p-2 text-center text-white text-sm font-bold">
                  FREE USA SHIPPING!
                </div>
              </div>
            </motion.div>

            {/* 3 Bottle Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              viewport={{ once: true }}
              className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 md:p-6 bg-white/5 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute -top-1 -right-1 w-24 h-24">
                <div className="absolute transform rotate-45 bg-blue-500 dark:bg-blue-400 text-white text-xs font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                  MOST POPULAR
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  3 BOTTLES
                </h3>
                <p className="text-lg font-medium">90 DAY SUPPLY</p>
              </div>

              <div className="flex justify-center mb-4 relative">
                <div className="absolute top-0 right-0 bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center transform rotate-12 shadow-lg">
                  <div className="text-center">
                    <p className="text-xs font-bold">SAVE</p>
                    <p className="text-sm font-bold">$270</p>
                  </div>
                </div>
                <Image
                  src="/supplement-bottles.png"
                  alt="3 Bottles of Tribal Force X"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              <div className="text-center mb-4">
                <p className="text-5xl font-bold">$59</p>
                <p className="text-lg text-[var(--text-secondary)]">/ bottle</p>
              </div>

              <Button
                className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 dark:from-indigo-400 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-600 text-base py-4 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-900/30 border border-indigo-400/20"
                onClick={() =>
                  window.open(
                    "https://thetribalforcex.com/start/index.php?aff_id=12683&subid=renamelander"
                  )
                }
              >
                <span className="relative z-10 font-bold tracking-wider text-white">
                  BUY NOW
                </span>
                <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
