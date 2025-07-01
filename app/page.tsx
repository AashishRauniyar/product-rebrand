"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Zap, Leaf, Star, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Helper component for animated section entries
const AnimatedSection = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  // In a real app, you'd use Intersection Observer here.
  // For simplicity in Next.js, we'll just animate on mount.
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id={id}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className || ""}`}
    >
      {children}
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/30 text-foreground">
      <SiteHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <AnimatedSection className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1624362772755-4d5843e67047?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VwcGxlbWVudHN8ZW58MHwwfDB8fHww"
              alt="Abstract background"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-down [animation-delay:0.2s]">
                <span className="block">
                  Meet the <span className="text-primary">New Era</span> of
                </span>
                <span className="block text-primary">Verified Supplements</span>
              </h1>
              <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl animate-fade-in-up [animation-delay:0.4s]">
                Freshly rebranded for enhanced purity, potency, and performance.
                Elevate your wellness journey with us.
              </p>
              <div className="mt-10 flex justify-center gap-4 animate-fade-in-up [animation-delay:0.6s]">
                <Button
                  size="lg"
                  asChild
                  className="shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
                >
                  <Link href="#cta">
                    Explore Products <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <Link href="#rebrand">Learn About Rebrand</Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* "Why Rebranded?" Section */}
        <AnimatedSection id="rebrand" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why the <span className="text-primary">Change</span>?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We've evolved. Our rebrand reflects our commitment to
                cutting-edge science, transparency, and your ultimate
                well-being.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Enhanced Potency",
                  description:
                    "Formulas optimized with the latest research for maximum effectiveness.",
                },
                {
                  icon: ShieldCheck,
                  title: "Unwavering Quality",
                  description:
                    "Stricter testing and sourcing for ingredients you can trust.",
                },
                {
                  icon: Leaf,
                  title: "Sustainable Focus",
                  description:
                    "Eco-friendly packaging and practices, because we care for you and the planet.",
                },
              ].map((item, index) => (
                <Card
                  key={item.title}
                  className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardHeader>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Product Features Section */}
        <AnimatedSection id="features" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Experience{" "}
                  <span className="text-primary">VitalityBoost X</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Our flagship rebranded product, VitalityBoost X, is
                  meticulously crafted to support your energy, focus, and
                  overall health.
                </p>
                <ul className="mt-8 space-y-6">
                  {[
                    {
                      name: "Sustained Energy Release",
                      description:
                        "No jitters, no crash. Just clean, all-day energy.",
                      icon: Zap,
                    },
                    {
                      name: "Cognitive Enhancement",
                      description: "Sharpen your focus and mental clarity.",
                      icon: Leaf,
                    },
                    {
                      name: "Immune System Support",
                      description: "Fortify your body's natural defenses.",
                      icon: ShieldCheck,
                    },
                  ].map((feature) => (
                    <li key={feature.name} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground">
                          <feature.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium leading-6">
                          {feature.name}
                        </h3>
                        <p className="mt-1 text-base text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 lg:mt-0 relative aspect-square animate-fade-in-right [animation-delay:0.3s]">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1670459706285-5a62ed024286?q=80&w=1997&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="VitalityBoost X Product"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection
          id="testimonials"
          className="py-16 md:py-24 bg-background"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Loved by <span className="text-primary">Customers</span> Like
                You
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Real stories, real results.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah L.",
                  review:
                    "The new VitalityBoost X is a game-changer! I have so much more energy throughout the day.",
                  avatar:
                    "https://source.unsplash.com/100x100/?woman,portrait,smiling",
                  rating: 5,
                },
                {
                  name: "Mike P.",
                  review:
                    "Impressed with the quality and the noticeable difference in my focus. Highly recommend!",
                  avatar:
                    "https://source.unsplash.com/100x100/?man,portrait,professional",
                  rating: 5,
                },
                {
                  name: "Jessica B.",
                  review:
                    "Love the new branding and the product feels even better than before. My go-to supplement now.",
                  avatar:
                    "https://source.unsplash.com/100x100/?woman,fitness,happy",
                  rating: 4,
                },
              ].map((testimonial, index) => (
                <Card
                  key={testimonial.name}
                  className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground/50"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-muted-foreground italic">
                      "{testimonial.review}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Call to Action Section */}
        <AnimatedSection
          id="cta"
          className="py-16 md:py-24 bg-primary/90 text-primary-foreground"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to{" "}
                <span className="underline decoration-wavy decoration-yellow-300">
                  Elevate
                </span>{" "}
                Your Wellness?
              </h2>
              <p className="mt-4 text-lg opacity-90">
                Join thousands of satisfied customers and experience the
                Verified Supplements difference. Your journey to optimal health
                starts now.
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="mt-10 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-bounce-slow [animation-delay:0.5s]"
              >
                <Link href="/shop">Shop All Products</Link>
              </Button>
              <p className="mt-4 text-sm opacity-80">
                Special launch discount available for a limited time!
              </p>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <SiteFooter />
    </div>
  );
}
