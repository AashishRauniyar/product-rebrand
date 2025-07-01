"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Product } from "@/lib/models/product";

interface ProductLearnMoreProps {
  product?: Product;
}

export default function RenameInfoModal({ product }: ProductLearnMoreProps) {
  const closeModal = () => {
    document.getElementById("rename-info-modal")?.classList.add("hidden");
  };

  // Close modal when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const modal = document.getElementById("rename-info-modal");
      const modalContent = document.getElementById("modal-content");

      if (modal && modalContent && !modalContent.contains(e.target as Node)) {
        modal.classList.add("hidden");
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close modal with escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.getElementById("rename-info-modal")?.classList.add("hidden");
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div
      id="rename-info-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm hidden p-4"
    >
      <div
        id="modal-content"
        className="bg-gradient-to-br from-[var(--modal-bg-from)] to-[var(--modal-bg-to)] rounded-2xl p-5 md:p-8 max-w-2xl w-full mx-auto border border-[var(--card-border)] shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
            Why We Renamed Our Product
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto"></div>
        </div>

        <div className="space-y-3 md:space-y-4 text-[var(--text-secondary)] text-sm md:text-base">
          <p>
            We've recently renamed our popular male enhancement formula to{" "}
            <span className="font-bold text-[var(--text-primary)]">
              {product?.name}
            </span>
            . This decision was made to protect our customers and maintain the
            integrity of our brand.
          </p>

          <h3 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mt-4 md:mt-6">
            Why We Made This Change:
          </h3>

          <ul className="space-y-2 md:space-y-3 list-disc pl-5">
            <li>
              <span className="text-[var(--text-primary)] font-semibold">
                Combating Counterfeits:
              </span>{" "}
              Our product's popularity has unfortunately led to counterfeit
              versions flooding the market. These fake products often contain
              harmful ingredients or no active ingredients at all.
            </li>
            <li>
              <span className="text-[var(--text-primary)] font-semibold">
                Protecting Our Customers:
              </span>{" "}
              By rebranding to {product?.name}, we're making it easier for
              customers to identify the genuine product and avoid potentially
              dangerous counterfeits.
            </li>
            <li>
              <span className="text-[var(--text-primary)] font-semibold">
                Enhanced Formula:
              </span>{" "}
              Along with the name change, we've also slightly improved our
              formula to deliver even better results while maintaining the same
              safety profile.
            </li>
            <li>
              <span className="text-[var(--text-primary)] font-semibold">
                New Security Features:
              </span>{" "}
              Our new packaging includes advanced security features that make it
              nearly impossible to counterfeit, ensuring you always get the
              genuine product.
            </li>
          </ul>

          <p className="mt-4 md:mt-6">
            Rest assured, while the name has changed, the core formula that has
            helped thousands of men improve their performance remains largely
            the same, with some enhancements to make it even more effective.
          </p>

          <p className="font-bold text-[var(--text-primary)]">
            {product?.name} is the ONLY authentic version of our product. If you
            see our old name being sold elsewhere, it is likely a counterfeit
            and should be avoided.
          </p>
        </div>
      </div>
    </div>
  );
}
