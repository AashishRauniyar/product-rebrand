import type { Product } from "@/lib/models/product";

interface FooterProps {
  product: Product;
}
export default function Footer({ product }: FooterProps) {
  return (
    <footer className="bg-black text-white dark:bg-white dark:text-black py-4 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div>
            <h3 className="text-sm md:text-lg font-bold mb-2 md:mb-4">{product?.name}</h3>
            <p className="text-[10px] md:text-sm text-gray-400 dark:text-gray-600 mb-3 md:mb-4">
              The premium male enhancement formula designed to help you achieve peak performance and confidence.
            </p>
          </div>

          <div>
            <h3 className="text-sm md:text-lg font-bold mb-2 md:mb-4">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2 text-[10px] md:text-sm text-gray-400 dark:text-gray-600">
              <li>
                <a href="#product" className="hover:text-white dark:hover:text-black transition-colors">
                  Product
                </a>
              </li>
              <li>
                <a href="#ingredients" className="hover:text-white dark:hover:text-black transition-colors">
                  Ingredients
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-white dark:hover:text-black transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white dark:hover:text-black transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white dark:hover:text-black transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#order" className="hover:text-white dark:hover:text-black transition-colors">
                  Order Now
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm md:text-lg font-bold mb-2 md:mb-4">Legal</h3>
            <ul className="space-y-1 md:space-y-2 text-[10px] md:text-sm text-gray-400 dark:text-gray-600">
              <li>
                <a href="/privacy-policy" className="hover:text-white dark:hover:text-black transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="hover:text-white dark:hover:text-black transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/shipping-policy" className="hover:text-white dark:hover:text-black transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/return-policy" className="hover:text-white dark:hover:text-black transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 md:mt-8 pt-3 md:pt-8 border-t border-gray-800 dark:border-gray-300">
          <div className="text-[9px] md:text-xs text-gray-500 dark:text-gray-600">
            <p className="mb-2 md:mb-4">
              <strong>Affiliate Disclaimer:</strong> Some links on this page may be affiliate links. If you click on
              these links and make a purchase, we may receive a commission at no additional cost to you.
            </p>
            <p className="mb-2 md:mb-4">
              <strong>FDA Disclaimer:</strong> These statements have not been evaluated by the Food and Drug
              Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p>© {new Date().getFullYear()} {product?.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
