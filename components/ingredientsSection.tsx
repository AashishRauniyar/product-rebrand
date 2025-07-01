"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { type Ingredient as DBIngredient } from "@/lib/models/ingredient";

// For backward compatibility with hardcoded data
interface LegacyIngredient {
  name: string;
  description: string;
  image: string;
}

type IngredientType = DBIngredient | LegacyIngredient;

interface IngredientsSectionProps {
  ingredients: DBIngredient[];
  productImage: string;
}

// Helper functions to handle both ingredient formats
function getIngredientTitle(ingredient: IngredientType): string {
  if ("title" in ingredient) return ingredient.title;
  if ("name" in ingredient) return ingredient.name;
  return "Ingredient";
}

function getIngredientDescription(ingredient: IngredientType): string {
  if ("description" in ingredient) return ingredient.description;
  return "";
}

function getIngredientImage(
  ingredient: IngredientType,
  productImage: string
): string {
  if (
    "image" in ingredient &&
    typeof ingredient.image === "string" &&
    ingredient.image
  ) {
    return ingredient.image;
  }
  return productImage || "/placeholder.svg";
}

// Function to generate a stable key for ingredients
function getIngredientKey(ingredient: IngredientType, index: number): string {
  if ("id" in ingredient && ingredient.id) return `ingredient-${ingredient.id}`;
  if ("title" in ingredient)
    return `ingredient-${ingredient.title
      .replace(/\s+/g, "-")
      .toLowerCase()}-${index}`;
  if ("name" in ingredient)
    return `ingredient-${ingredient.name
      .replace(/\s+/g, "-")
      .toLowerCase()}-${index}`;
  return `ingredient-${index}`;
}

export default function IngredientsSection({
  ingredients,
  productImage,
}: IngredientsSectionProps) {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full filter blur-[100px] opacity-10 dark-theme:opacity-10 light-theme:opacity-5"></div>

        <div className="relative">
          <div className="flex items-center justify-center mb-6 md:mb-10">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full max-w-xs hidden md:block"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[var(--text-primary)] mx-0 md:mx-6">
              Key Ingredients
            </h2>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full max-w-xs hidden md:block"></div>
          </div>

          <div className="space-y-3 md:space-y-6">
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={getIngredientKey(ingredient, index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.1 }}
                className="bg-[var(--card-inner-bg)] p-3 md:p-6 rounded-lg md:rounded-2xl border border-[var(--card-inner-border)] backdrop-blur-sm group hover:bg-[var(--card-inner-hover)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] dark-theme:hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] light-theme:hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[var(--ingredient-border)] shadow-lg shadow-blue-900/20 dark-theme:shadow-blue-900/20 light-theme:shadow-blue-500/10">
                      <Image
                        src={
                          typeof ingredient.image === "string"
                            ? ingredient.image
                            : productImage || "/placeholder.svg"
                        }
                        alt={getIngredientTitle(ingredient)}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-base md:text-xl font-bold text-[var(--ingredient-title)] group-hover:opacity-80 transition-colors duration-300 mb-1 md:mb-2">
                      {getIngredientTitle(ingredient)}
                    </h3>
                    <p className="text-xs md:text-base text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-300">
                      {getIngredientDescription(ingredient)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
