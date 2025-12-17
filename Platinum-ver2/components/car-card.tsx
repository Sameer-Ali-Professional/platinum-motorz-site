import Image from "next/image"
import Link from "next/link"
import { Calendar, Gauge, Fuel } from "lucide-react"

interface CarCardProps {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  image: string
  fuelType?: string
}

export function CarCard({ id, make, model, year, mileage, price, image, fuelType = "Petrol" }: CarCardProps) {
  return (
    <Link href={`/stock/${id}`} className="block">
      <div className="group relative bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
        <div className="relative h-64 w-full overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg?height=400&width=600&query=luxury+car"}
            alt={`${year} ${make} ${model} - Premium luxury vehicle available at Platinum Motorz`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {make} {model}
          </h3>

          <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>{year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>{mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>{fuelType}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-3xl font-bold text-primary">£{price.toLocaleString()}</span>
            <span className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold group-hover:bg-accent transition-colors">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
