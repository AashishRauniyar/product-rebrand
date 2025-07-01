"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/models/product";

interface TestimonialsSectionProps {
  product?: Product;
}

export default function TestimonialsSection({ product }: TestimonialsSectionProps) {
  const testimonials = [
    {
      text: `I've been using ${product?.name} for 3 weeks, and the results are amazing! It gave me the energy and confidence I needed. My workouts are more productive and I feel stronger than ever.`,
      name: "Michael R.",
      age: 42,
      location: "New York, NY",
      rating: 5,
      image: "/images/testimonials/michael.png",
    },
    {
      text:  `I'm amazed by how quickly I felt the difference. My workouts are better, and my energy levels have skyrocketed! I've tried other supplements before, but nothing compares to  ${product?.name}.`,
      name: "David T.",
      age: 38,
      location: "Los Angeles, CA",
      rating: 5,
      image: "/images/testimonials/david.png",
    },
    {
      text: `After trying several products, ${product?.name} is the only one that delivered real results. Highly recommended! I've noticed significant improvements in just two weeks of use.`,
      name: "James K.",
      age: 45,
      location: "Chicago, IL",
      rating: 4,
      image: "/images/testimonials/james.png",
    },
  ];

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full filter blur-[100px] opacity-10 dark-theme:opacity-10 light-theme:opacity-5"></div>

        <div className="relative">
          <div className="flex items-center justify-center mb-6 md:mb-10">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full max-w-xs hidden md:block"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[var(--text-primary)] mx-0 md:mx-6">
              Customer Reviews
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full max-w-xs hidden md:block"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.1 }}
                className="bg-[var(--card-inner-bg)] p-3 md:p-6 rounded-lg md:rounded-2xl border border-[var(--card-inner-border)] backdrop-blur-sm group hover:bg-[var(--card-inner-hover)] transition-all duration-300 relative"
              >
                <Quote className="absolute top-3 right-3 w-4 h-4 md:w-8 md:h-8 text-[var(--testimonial-quote)]" />

                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[var(--testimonial-border)] mr-2 md:mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={`${testimonial.name} photo`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-primary)] text-xs md:text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-[0.65rem] md:text-sm text-[var(--text-secondary)]">
                      {testimonial.age}, {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex mb-2 md:mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 md:w-5 md:h-5 ${
                        i < testimonial.rating
                          ? "fill-[var(--star-filled)] text-[var(--star-filled)]"
                          : "text-[var(--star-empty)]"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs md:text-base text-[var(--text-secondary)] italic mb-3 md:mb-4 group-hover:text-[var(--text-primary)] transition-colors duration-300 line-clamp-4 md:line-clamp-none">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
