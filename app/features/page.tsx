import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Zap, Leaf, ShieldCheck, Brain, Heart, Bone } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Features - Verified Supplements",
  description:
    "Explore the powerful features and benefits of our premium supplements, including VitalityBoost X.",
};

const features = [
  {
    name: "Sustained Energy Release",
    description:
      "Our advanced formula provides clean, all-day energy without the jitters or crash typically associated with stimulants. Perfect for busy professionals and active individuals.",
    icon: Zap,
    details:
      "Utilizes a blend of natural energizers and adaptogens that support your body's natural energy production cycles.",
  },
  {
    name: "Enhanced Cognitive Function",
    description:
      "Sharpen your focus, improve mental clarity, and boost productivity with ingredients proven to support brain health.",
    icon: Brain,
    details:
      "Contains nootropics and essential nutrients that nourish brain cells and optimize neurotransmitter activity.",
  },
  {
    name: "Robust Immune System Support",
    description:
      "Fortify your body's natural defenses with a potent mix of vitamins, minerals, and antioxidants.",
    icon: ShieldCheck,
    details:
      "A comprehensive blend designed to strengthen your immune response and protect against daily stressors.",
  },
  {
    name: "Cardiovascular Health",
    description:
      "Support a healthy heart and circulatory system with ingredients known for their cardiovascular benefits.",
    icon: Heart,
    details:
      "Includes Omega-3s, CoQ10, and other heart-healthy compounds to maintain optimal cardiovascular function.",
  },
  {
    name: "Bone and Joint Strength",
    description:
      "Promote strong bones and flexible joints for an active lifestyle at any age.",
    icon: Bone,
    details:
      "A synergistic mix of Calcium, Vitamin D3, Magnesium, and other key nutrients for skeletal health.",
  },
  {
    name: "Natural & Pure Ingredients",
    description:
      "We use only high-quality, lab-verified ingredients, free from artificial fillers, colors, or preservatives.",
    icon: Leaf,
    details:
      "Sourced from trusted suppliers and rigorously tested for purity and potency. Full transparency in our labeling.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow py-12 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Discover the <span className="text-primary">Power Within</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              Our supplements are meticulously crafted with
              scientifically-backed ingredients to deliver exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="flex-shrink-0 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">{feature.name}</h2>
                <p className="text-muted-foreground text-sm mb-3 flex-grow">
                  {feature.description}
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  {feature.details}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Image
              src="https://plus.unsplash.com/premium_photo-1730578183644-d6bc6d308851?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3VwcGxlbWVudHN8ZW58MHwwfDB8fHww"
              alt="Collection of Verified Supplements products"
              width={800}
              height={500}
              className="rounded-lg shadow-2xl mx-auto"
            />
            <p className="mt-6 text-lg text-muted-foreground">
              Ready to experience the difference?
            </p>
            <Button size="lg" asChild className="mt-4">
              <Link href="/shop">Shop Our Products</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
