"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StockFiltersProps {
  onFilterChange: (filters: {
    make: string
    priceRange: string
    mileage: string
  }) => void
}

export function StockFilters({ onFilterChange }: StockFiltersProps) {
  const [filters, setFilters] = useState({
    make: "all",
    priceRange: "all",
    mileage: "all",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-12">
      <h2 className="text-xl font-semibold text-foreground mb-6">Filter Vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Make</label>
          <Select value={filters.make} onValueChange={(value) => handleFilterChange("make", value)}>
            <SelectTrigger className="w-full bg-background border-border text-foreground hover:border-primary transition-colors">
              <SelectValue placeholder="All Makes" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Makes</SelectItem>
              <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
              <SelectItem value="bmw">BMW</SelectItem>
              <SelectItem value="audi">Audi</SelectItem>
              <SelectItem value="porsche">Porsche</SelectItem>
              <SelectItem value="range-rover">Range Rover</SelectItem>
              <SelectItem value="lexus">Lexus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Price Range</label>
          <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
            <SelectTrigger className="w-full bg-background border-border text-foreground hover:border-primary transition-colors">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-25000">Under £25,000</SelectItem>
              <SelectItem value="25000-50000">£25,000 - £50,000</SelectItem>
              <SelectItem value="50000-75000">£50,000 - £75,000</SelectItem>
              <SelectItem value="75000-100000">£75,000 - £100,000</SelectItem>
              <SelectItem value="100000+">£100,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Mileage</label>
          <Select value={filters.mileage} onValueChange={(value) => handleFilterChange("mileage", value)}>
            <SelectTrigger className="w-full bg-background border-border text-foreground hover:border-primary transition-colors">
              <SelectValue placeholder="All Mileage" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Mileage</SelectItem>
              <SelectItem value="0-10000">Under 10,000 miles</SelectItem>
              <SelectItem value="10000-30000">10,000 - 30,000 miles</SelectItem>
              <SelectItem value="30000-50000">30,000 - 50,000 miles</SelectItem>
              <SelectItem value="50000-75000">50,000 - 75,000 miles</SelectItem>
              <SelectItem value="75000+">75,000+ miles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
