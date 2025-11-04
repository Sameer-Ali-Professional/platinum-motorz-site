import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Platinum Motorz - Premium Luxury Car Dealership in Oldham",
  description:
    "Discover premium luxury vehicles at Platinum Motorz in Oldham. Quality cars, affordable finance options, and trusted service. Browse our exclusive collection of Mercedes, BMW, Audi, Porsche, and more.",
  keywords: "luxury cars Oldham, premium car dealership, Mercedes Oldham, BMW Oldham, Audi Oldham, car finance Oldham",
  openGraph: {
    title: "Platinum Motorz - Premium Luxury Car Dealership",
    description: "Experience luxury on every drive with Platinum Motorz in Oldham",
    type: "website",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
