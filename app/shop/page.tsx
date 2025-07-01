import type { Metadata } from "next"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, Info } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shop Our Supplements - Verified Supplements",
  description: "Browse our collection of premium, rebranded supplements designed for your health and wellness.",
}

const products = [
  {
    id: "prod_vbX",
    name: "VitalityBoost X",
    description: "All-day energy, enhanced focus, and immune support. Our flagship formula.",
    price: "49.99",
    image: "https://source.unsplash.com/400x400/?supplement,bottle,energy",
    category: "Energy & Focus",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: "prod_csF",
    name: "CogniSharp Focus",
    description: "Maximize mental clarity and cognitive performance with natural nootropics.",
    price: "54.99",
    image: "https://source.unsplash.com/400x400/?supplement,bottle,focus",
    category: "Cognitive Health",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: "prod_igP",
    name: "ImmuneGuard Plus",
    description: "Strengthen your body's natural defenses with essential vitamins and antioxidants.",
    price: "39.99",
    image: "https://source.unsplash.com/400x400/?supplement,bottle,immune",
    category: "Immune Support",
    rating: 4.9,
    reviews: 150,
  },
  {
    id: "prod_rcM",
    name: "RecoverMax Pro",
    description: "Optimize muscle recovery and growth post-workout with this advanced blend.",
    price: "62.50",
    image: "https://source.unsplash.com/400x400/?supplement,bottle,fitness,recovery",
    category: "Fitness & Recovery",
    rating: 4.6,
    reviews: 78,
  },
  {
    id: "prod_slS",
    name: "SereneSleep Aid",
    description: "Natural ingredients to promote restful sleep and wake up refreshed.",
    price: "35.00",
    image: "https://source.unsplash.com/400x400/?supplement,bottle,sleep",
    category: "Sleep Support",
    rating: 4.5,
    reviews: 60,
  },
  {
    id: "prod_om3",
    name: "OmegaPure Fish Oil",
    description: "High-potency Omega-3s for heart, brain, and joint health.",
    price: "29.99",
    image: "https://source.unsplash.com/400x400/?supplement,bottle,fishoil",
    category: "Essential Fatty Acids",
    rating: 4.8,
    reviews: 110,
  },
]

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow py-12 md:py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Our Premium <span className="text-primary">Supplement Collection</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              Invest in your health with our scientifically formulated, high-quality supplements.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="p-0 relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-48 md:h-56"
                  />
                  <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center">
                    <Tag className="h-3 w-3 mr-1" /> {product.category}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-lg font-semibold mb-1 hover:text-primary transition-colors">
                    <Link href={`/shop/${product.id}`}>{product.name}</Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-3 h-16 overflow-hidden">{product.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {/* Placeholder for rating */}
                    <span className="text-yellow-500">
                      {"★".repeat(Math.floor(product.rating))}
                      {"☆".repeat(5 - Math.floor(product.rating))}
                    </span>
                    <span className="ml-1">({product.reviews} reviews)</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-xl font-bold text-primary">${product.price}</p>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/shop/${product.id}`}>
                        <Info className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </Button>
                    {/* <Button size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button> */}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
