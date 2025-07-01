import { getProductWithDetails } from "@/lib/models/product";
import { notFound } from "next/navigation";
import ProductHero from "@/components/product-hero";
import BenefitsSection from "@/components/benefitsSection";
import IngredientsSection from "@/components/ingredientsSection";
import TestimonialsSection from "@/components/testimonials-section";
import CallToAction from "@/components/call-to-action";
import StickyOrderButton from "@/components/sticky-order-button";
import CtaBoxes from "@/components/cta-boxes";
import ProductFeatures from "@/components/product-features";
import RenameInfoModal from "@/components/rename-info-modal";
import ThemeNavigation from "@/components/theme-navigation";
import NewCta from "@/components/new-cta";
import Footer from "@/components/footer";
import BuyNotification from "@/components/buy-notification";
import BuyerAlert from "@/components/buyer-alert";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

// Helper to generate a robust key
const generateItemKey = (item: any, index: number): string => {
  // Use item.id if it exists and is a string/number, otherwise use index
  return item && (typeof item.id === "string" || typeof item.id === "number")
    ? item.id.toString()
    : `item-${index}`;
};

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  // Await params as suggested by the error message
  const awaitedParams = await params;
  const product = await getProductWithDetails(awaitedParams.slug);

  if (!product) {
    notFound();
  }

  console.log("Product why_choose data:", product.why_choose);

  // Generate CSS variables from theme
  const generateThemeCSS = () => {
    if (!product.theme) return "";

    return `
      :root {
        --bg-gradient-from: ${product.theme.primary_bg_color};
        --bg-gradient-via: ${product.theme.secondary_bg_color};
        --bg-gradient-to: ${product.theme.accent_bg_color};
        --text-primary: ${product.theme.primary_text_color};
        --text-secondary: ${product.theme.secondary_text_color};
        --text-accent: ${product.theme.accent_text_color};
        --link-color: ${product.theme.link_color};
        --link-hover-color: ${product.theme.link_hover_color};
        --button-primary-bg: ${product.theme.primary_button_bg};
        --button-primary-text: ${product.theme.primary_button_text};
        --button-primary-hover: ${product.theme.primary_button_hover_bg};
        --button-secondary-bg: ${product.theme.secondary_button_bg};
        --button-secondary-text: ${product.theme.secondary_button_text};
        --button-secondary-hover: ${product.theme.secondary_button_hover_bg};
        --card-bg: ${product.theme.card_bg_color};
        --card-border: ${product.theme.card_border_color};
        --card-shadow: ${product.theme.card_shadow_color};
        --header-bg: ${product.theme.header_bg_color};
        --header-text: ${product.theme.header_text_color};
        --footer-bg: ${product.theme.footer_bg_color};
        --footer-text: ${product.theme.footer_text_color};
        --font-family: ${product.theme.font_family};
        --h1-size: ${product.theme.h1_font_size};
        --h1-weight: ${product.theme.h1_font_weight};
        --h2-size: ${product.theme.h2_font_size};
        --h2-weight: ${product.theme.h2_font_weight};
        --h3-size: ${product.theme.h3_font_size};
        --h3-weight: ${product.theme.h3_font_weight};
        --body-size: ${product.theme.body_font_size};
        --body-line-height: ${product.theme.body_line_height};
        --section-padding: ${product.theme.section_padding};
        --card-padding: ${product.theme.card_padding};
        --button-padding: ${product.theme.button_padding};
        --radius-sm: ${product.theme.border_radius_sm};
        --radius-md: ${product.theme.border_radius_md};
        --radius-lg: ${product.theme.border_radius_lg};
        --radius-xl: ${product.theme.border_radius_xl};
        --max-width: ${product.theme.max_width};
        --container-padding: ${product.theme.container_padding};
        --gradient-start: ${product.theme.gradient_start};
        --gradient-end: ${product.theme.gradient_end};
        --shadow-color: ${product.theme.shadow_color};
      }

      ${product.theme.custom_css ?? ""}
    `;
  };

  return (
    <>
      {product.theme && (
        <style dangerouslySetInnerHTML={{ __html: generateThemeCSS() }} />
      )}

      <main className="min-h-screen bg-gradient-to-b from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] text-[var(--text-primary)] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-white">
        <div className="relative">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/bg-pattern.png')] opacity-5 dark:opacity-10"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px] opacity-20 dark:opacity-30"></div>
            <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px] opacity-20 dark:opacity-30"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px] opacity-10 dark:opacity-20"></div>
          </div>

          {/* Content */}
          <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-8">
            <ThemeNavigation />

            <div className="text-center mb-6 md:mb-12 pt-4 md:pt-8">
              <BuyerAlert product={product} />

              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold mb-2 md:mb-4 text-black dark:text-white text-center">
                THIS PRODUCT HAS BEEN RENAMED TO
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-red-600 dark:text-red-500 text-center">
                {product.name.toUpperCase()}
              </h2>
            </div>

            <div id="product">
              <ProductHero product={product} />
            </div>

            {product.ingredients && product.ingredients.length > 0 && (
              <div id="ingredients">
                <IngredientsSection
                  ingredients={product.ingredients}
                  productImage={product.product_image}
                />
              </div>
            )}

            <div id="benefits">
              <NewCta product={product} />
              <CtaBoxes position="top" product={product} />
              {product.why_choose && product.why_choose.length > 0 && (
                <BenefitsSection
                  productName={product.name}
                  whyChoose={product.why_choose.map(
                    (item: any, index: number) => ({
                      key: generateItemKey(item, index),
                      id: item.id,
                      title: item.title,
                      description: item.description,
                      display_order: item.display_order,
                    })
                  )}
                />
              )}
            </div>

            <div id="features">
              <ProductFeatures product={product} />
              <CtaBoxes position="middle" product={product} />
            </div>

            <div id="testimonials">
              <TestimonialsSection product={product} />
            </div>

            <div id="order">
              <CallToAction product={product} />
            </div>
          </div>
        </div>

        <StickyOrderButton product={product} />
        <RenameInfoModal product={product} />
        <BuyNotification product={product} />
        <Footer product={product} />
      </main>
    </>
  );
}
