import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Generate a slug from a string
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Validate product data
export function validateProduct(data: any): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "Product name is required";
  }

  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required";
  }

  if (!data.redirect_link || data.redirect_link.trim() === "") {
    errors.redirect_link = "Redirect link is required";
  } else if (!isValidUrl(data.redirect_link)) {
    errors.redirect_link = "Invalid URL format";
  }

  if (!data.money_back_days || isNaN(Number.parseInt(data.money_back_days))) {
    errors.money_back_days = "Money back guarantee days must be a number";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validate ingredient data
export function validateIngredient(data: any): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim() === "") {
    errors.title = "Ingredient title is required";
  }

  if (!data.description || data.description.trim() === "") {
    errors.description = "Ingredient description is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validate why choose data
export function validateWhyChoose(data: any): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim() === "") {
    errors.title = "Title is required";
  }

  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Check if a string is a valid URL
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
