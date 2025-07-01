import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ShieldCheck,
  Leaf,
  RefreshCw,
  Package,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Rebrand Story - Verified Supplements",
  description:
    "Learn about why Verified Supplements underwent a rebrand and our renewed commitment to quality and innovation.",
};

const rebrandPoints = [
  {
    icon: RefreshCw,
    title: "A Fresh Vision",
    description:
      "Our rebrand signifies a renewed commitment to being at the forefront of health and wellness innovation. We're embracing the future with a clearer focus on what matters most: your well-being.",
  },
  {
    icon: Zap,
    title: "Enhanced Potency & Formulas",
    description:
      "We've taken this opportunity to revisit and optimize our product formulas, incorporating the latest scientific research to ensure maximum effectiveness and bioavailability.",
  },
  {
    icon: ShieldCheck,
    title: "Unwavering Commitment to Quality",
    description:
      "While our look has changed, our dedication to sourcing the highest quality ingredients and maintaining rigorous testing standards remains stronger than ever. Your trust is paramount.",
  },
  {
    icon: Package,
    title: "Sustainable & Modern Packaging",
    description:
      "Our new packaging is not only visually appealing but also reflects our commitment to sustainability. We're using more eco-friendly materials without compromising product integrity.",
  },
  {
    icon: Sparkles,
    title: "Improved Customer Experience",
    description:
      "The rebrand extends to how we connect with you. Expect a more intuitive website, clearer product information, and enhanced support to guide you on your wellness journey.",
  },
  {
    icon: Leaf,
    title: "Focus on Transparency",
    description:
      "We believe you have the right to know exactly what you're putting into your body. Our new branding emphasizes clarity and honesty in our ingredient sourcing and product benefits.",
  },
];

export default function RebrandPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow py-12 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Evolving for <span className="text-primary">You</span>
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl">
              We've refreshed our brand to better reflect our core values and
              our dedication to providing you with the best in health
              supplements.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative mb-12">
              <Image
                src="https://plus.unsplash.com/premium_photo-1673589625805-eaafd711a942?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHN1cHBsZW1lbnRzfGVufDB8MHwwfHx8MA%3D%3D"
                alt="Comparison of old and new supplement branding"
                width={1200}
                height={600}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg flex items-end p-8">
                <h2 className="text-3xl font-semibold text-white">
                  The Next Chapter of Verified Supplements
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {rebrandPoints.slice(0, 2).map((point) => (
                <div
                  key={point.title}
                  className="bg-card p-6 rounded-lg shadow-md"
                >
                  <point.icon className="h-10 w-10 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="prose prose-lg max-w-none mx-auto text-muted-foreground mb-12">
              <p>
                At Verified Supplements, we've always been driven by a passion
                for health and a commitment to scientific integrity. As the
                wellness landscape evolves, so do we. Our decision to rebrand
                was born from a desire to better communicate our core values and
                to elevate your experience with our products.
              </p>
              <p>
                This isn't just a new logo or different packaging; it's a
                reflection of our deepened commitment to you. We've listened to
                your feedback, embraced new research, and refined our processes
                to bring you supplements that are more effective, more
                transparent, and more aligned with a holistic approach to
                well-being.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {rebrandPoints.slice(2).map((point) => (
                <div
                  key={point.title}
                  className="bg-card p-6 rounded-lg shadow-md"
                >
                  <point.icon className="h-10 w-10 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">
              We're excited for you to experience the new Verified Supplements.
            </p>
            <Button size="lg" asChild className="mt-4">
              <Link href="/shop">Explore Our Rebranded Products</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
