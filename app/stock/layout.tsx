import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Our Stock - Premium Luxury Cars | Platinum Motorz",
  description:
    "Browse our exclusive collection of premium luxury vehicles at Platinum Motorz. Mercedes-Benz, BMW, Audi, Porsche, Range Rover, and more. Quality cars with flexible finance options in Oldham.",
  keywords:
    "luxury cars for sale, premium vehicles Oldham, Mercedes for sale, BMW for sale, Audi for sale, Porsche for sale",
}

export default function StockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
