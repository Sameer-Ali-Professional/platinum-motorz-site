import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center gap-8 py-20">
          <div className="animate-fade-in-glow animate-pulse-glow">
            <Image
              src="/logo.png"
              alt="Platinum Motorz - Premium Luxury Car Dealership Logo with Gold Shield and Wings"
              width={400}
              height={400}
              className="w-64 h-64 md:w-96 md:h-96 object-contain"
              priority
            />
          </div>

          {/* Tagline */}
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
              Experience Luxury
              <span className="block text-primary">On Every Drive</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover premium vehicles that combine elegance, performance, and unmatched quality
            </p>
          </div>

          {/* CTA Button */}
          <Link href="/stock">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]"
            >
              View Our Stock
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
