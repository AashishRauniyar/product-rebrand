"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  display_order?: number;
}

interface BenefitsSectionProps {
  productName: string;
  whyChoose: WhyChooseItem[];
}

// Function to generate a stable key for whyChoose items
function getWhyChooseKey(item: WhyChooseItem, index: number): string {
  // Use item.id if it exists and is not null/undefined, converting to string
  if (item.id !== null && item.id !== undefined)
    return `whychoose-${item.id.toString()}`;
  // Fallback using title and index if id is not available
  return `whychoose-${item.title.replace(/\s+/g, "-").toLowerCase()}-${index}`;
}

export default function BenefitsSection({
  productName,
  whyChoose,
}: BenefitsSectionProps) {
  // Sort whyChoose items by display_order if available
  const sortedWhyChoose = [...(whyChoose || [])].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );

  if (!sortedWhyChoose || sortedWhyChoose.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 md:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true, amount: 0.1 }}
        className="backdrop-blur-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl md:rounded-3xl p-4 md:p-12 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] relative"
      >
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full filter blur-[100px] opacity-10 dark-theme:opacity-20 light-theme:opacity-5"></div>

        <div className="relative">
          <div className="flex items-center justify-center mb-4 md:mb-10">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full max-w-xs hidden md:block dark:via-indigo-400"></div>
            <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-center text-[var(--text-primary)] mx-0 md:mx-6">
              Why Choose {productName.toUpperCase()}
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full max-w-xs hidden md:block dark:via-indigo-400"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-2 md:gap-6">
            {sortedWhyChoose.map((item, index) => (
              <motion.div
                key={getWhyChooseKey(item, index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.1 }}
                className="flex items-start bg-[var(--card-inner-bg)] p-2 md:p-5 rounded-lg md:rounded-2xl border border-[var(--card-inner-border)] backdrop-blur-sm group hover:bg-[var(--card-inner-hover)] transition-all duration-300"
              >
                <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mr-2 md:mr-4 mt-0.5 md:mt-1">
                  <Check className="w-2 h-2 md:w-3 md:h-3 text-white" />
                </div>
                <div>
                  <h3 className="text-xs md:text-lg font-bold text-[var(--benefit-title)] mb-0.5 md:mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] md:text-base text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
