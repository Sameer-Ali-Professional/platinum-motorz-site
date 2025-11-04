"use client"

import { useState, useEffect } from "react"
import { StockFilters } from "@/components/stock-filters"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"

export default function StockPage() {
  const [displayedCars, setDisplayedCars] = useState(6)
  const [filteredCars, setFilteredCars] = useState<any[]>([])
  const [allCars, setAllCars] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => {
        setAllCars(data)
        setFilteredCars(data)
      })
      .catch((error) => {
        console.error("Error fetching cars:", error)
      })
  }, [])

  const handleFilterChange = (filters: { make: string; priceRange: string; mileage: string }) => {
    let filtered = allCars

    // Filter by make
    if (filters.make !== "all") {
      filtered = filtered.filter((car) => car.make.toLowerCase().replace("-", "") === filters.make)
    }

    // Filter by price range
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map((v) => {
        if (v.includes("+")) return [Number.parseInt(v), Number.POSITIVE_INFINITY]
        return Number.parseInt(v)
      })
      filtered = filtered.filter((car) => {
        if (Array.isArray(min)) {
          return car.price >= min[0]
        }
        return car.price >= min && car.price <= max
      })
    }

    // Filter by mileage
    if (filters.mileage !== "all") {
      const [min, max] = filters.mileage.split("-").map((v) => {
        if (v.includes("+")) return [Number.parseInt(v), Number.POSITIVE_INFINITY]
        return Number.parseInt(v)
      })
      filtered = filtered.filter((car) => {
        if (Array.isArray(min)) {
          return car.mileage >= min[0]
        }
        return car.mileage >= min && car.mileage <= max
      })
    }

    setFilteredCars(filtered)
    setDisplayedCars(6)
  }

  const handleLoadMore = () => {
    setDisplayedCars((prev) => Math.min(prev + 6, filteredCars.length))
  }

  const visibleCars = filteredCars.slice(0, displayedCars)
  const hasMore = displayedCars < filteredCars.length

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            Our Premium <span className="text-primary">Collection</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover our handpicked selection of luxury vehicles, each meticulously inspected and prepared to exceed
            your expectations.
          </p>
        </div>

        <StockFilters onFilterChange={handleFilterChange} />

        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="text-primary font-semibold">{visibleCars.length}</span> of{" "}
            <span className="text-primary font-semibold">{filteredCars.length}</span> vehicles
          </p>
        </div>

        {filteredCars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {visibleCars.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-accent font-semibold px-12 py-6 text-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]"
                >
                  Load More Vehicles
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No vehicles match your current filters. Please adjust your search criteria.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
