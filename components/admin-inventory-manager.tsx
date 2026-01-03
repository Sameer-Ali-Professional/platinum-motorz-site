"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Trash2, ExternalLink, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { CarEditDialog } from "@/components/car-edit-dialog"
import Image from "next/image"

interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  engine_size: string | null
  color: string | null
  doors: number | null
  description: string | null
  features: string[] | null
  images: string[] | null
  autotrader_id: string | null
  is_available: boolean
  created_at: string
}

export function AdminInventoryManager() {
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const fetchCars = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false })

    if (!error && data) {
      setCars(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleEdit = (car: Car) => {
    setEditingCar(car)
    setIsEditDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingCar(null)
    setIsEditDialogOpen(true)
  }

  const handleSaveComplete = () => {
    fetchCars()
  }

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    const { error } = await supabase.from("cars").update({ is_available: !currentStatus }).eq("id", id)

    if (!error) {
      fetchCars()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car from inventory?")) return

    const supabase = createClient()
    const { error } = await supabase.from("cars").delete().eq("id", id)

    if (!error) {
      fetchCars()
    }
  }

  return (
    <div className="space-y-6">
      <CarEditDialog
        car={editingCar}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveComplete}
      />

      <Card className="bg-black/40 backdrop-blur-sm border-[#D4AF37]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Inventory Management</CardTitle>
              <CardDescription className="text-gray-400">Manage your car listings</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 bg-transparent"
                onClick={handleAddNew}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Car
              </Button>
              <Button
                variant="outline"
                className="border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 bg-transparent"
                onClick={fetchCars}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-black/40 border border-[#D4AF37]/10 rounded-lg p-4 animate-pulse">
                  <div className="h-40 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No cars in inventory. Sync with Autotrader to add vehicles.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-white mb-4">
                Total: <span className="text-[#D4AF37] font-bold">{cars.length}</span> cars
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-black/40 border border-[#D4AF37]/10 rounded-lg overflow-hidden hover:border-[#D4AF37]/30 transition-all"
                  >
                    <div className="relative h-48">
                      <Image
                        src={car.images?.[0] || "/placeholder.svg?height=200&width=400&query=luxury+car"}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover"
                      />
                      {!car.is_available && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-white font-semibold">SOLD</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {car.mileage.toLocaleString()} miles • {car.fuel_type} • {car.transmission}
                          </p>
                        </div>
                        {car.autotrader_id && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            AT
                          </span>
                        )}
                      </div>
                      <p className="text-[#D4AF37] font-bold text-xl mb-4">£{car.price.toLocaleString()}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(car)}
                          className="flex-1 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAvailability(car.id, car.is_available)}
                          className={`${car.is_available ? "border-orange-500/20 text-orange-400 hover:bg-orange-500/10" : "border-green-500/20 text-green-400 hover:bg-green-500/10"}`}
                        >
                          {car.is_available ? "Sold" : "Available"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(car.id)}
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
