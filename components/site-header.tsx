"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Menu, X } from "lucide-react"
import { useState } from "react"

export const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/rebrand", label: "Our Rebrand" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/shop", label: "Shop Now" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <ShieldCheck className="h-8 w-8 text-primary group-hover:animate-pulse" />
            <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              VerifiedSupplements
            </span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg p-4 animate-in slide-in-from-top-4 fade-in-20 duration-300">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
