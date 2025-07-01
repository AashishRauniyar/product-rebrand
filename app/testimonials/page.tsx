import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

import { SiteFooter } from "@/components/site-footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customer Testimonials - Verified Supplements",
  description:
    "Read what our satisfied customers are saying about Verified Supplements and our rebranded products.",
};

const testimonials = [
  {
    name: "Sarah L.",
    location: "Austin, TX",
    review:
      "The new VitalityBoost X is a game-changer! I have so much more energy throughout the day, and I love the new packaging. The rebrand really shows their commitment to quality.",
    avatar: "https://source.unsplash.com/100x100/?woman,portrait,happy",
    rating: 5,
    product: "VitalityBoost X",
  },
  {
    name: "Mike P.",
    location: "Chicago, IL",
    review:
      "I've been a customer for years, and I'm thoroughly impressed with the rebrand. The product quality seems even better, and my focus has noticeably improved with the new formula.",
    avatar: "https://source.unsplash.com/100x100/?man,portrait,content",
    rating: 5,
    product: "CogniSharp Focus",
  },
  {
    name: "Jessica B.",
    location: "Miami, FL",
    review:
      "Love the new branding and the product feels even better than before. My go-to supplement now. The transparency about ingredients is also a big plus for me.",
    avatar: "https://source.unsplash.com/100x100/?woman,lifestyle,smiling",
    rating: 4,
    product: "ImmuneGuard Plus",
  },
  {
    name: "David K.",
    location: "Seattle, WA",
    review:
      "Was a bit skeptical about the rebrand at first, but I'm sold. The supplements are top-notch, and I appreciate the sustainable packaging efforts. Keep up the great work!",
    avatar: "https://source.unsplash.com/100x100/?man,outdoors,positive",
    rating: 5,
    product: "VitalityBoost X",
  },
  {
    name: "Emily R.",
    location: "Denver, CO",
    review:
      "The customer service was excellent when I had a question about the new formula. The product itself is fantastic. I feel more energetic and healthier overall.",
    avatar: "https://source.unsplash.com/100x100/?woman,professional,pleased",
    rating: 5,
    product: "MultiComplete Daily",
  },
  {
    name: "Tom H.",
    location: "New York, NY",
    review:
      "Great products and a brand I trust. The rebrand looks professional and modern. The effects of the supplements are noticeable within a week.",
    avatar: "https://source.unsplash.com/100x100/?man,urban,satisfied",
    rating: 4,
    product: "CogniSharp Focus",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow py-12 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Voices of <span className="text-primary">Satisfaction</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              Hear directly from our valued customers about their experiences
              with Verified Supplements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <CardContent className="pt-6 flex flex-col flex-grow">
                  <div className="flex items-start mb-4">
                    <Avatar className="h-12 w-12 mr-4 border-2 border-primary/50">
                      <AvatarImage
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        <UserCircle className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground italic text-sm mb-4 flex-grow">
                    <MessageSquare className="inline h-4 w-4 mr-1 opacity-50" />{" "}
                    "{testimonial.review}"
                  </blockquote>
                  {testimonial.product && (
                    <p className="text-xs text-primary font-medium">
                      Product Used: {testimonial.product}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">
              Ready to start your own success story?
            </p>
            <Button size="lg" asChild className="mt-4">
              <Link href="/shop">Shop Our Supplements</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
