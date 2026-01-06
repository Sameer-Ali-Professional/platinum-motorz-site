import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const make = searchParams.get("make")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const minMileage = searchParams.get("minMileage")
  const maxMileage = searchParams.get("maxMileage")

  let query = supabase.from("cars").select("*").eq("is_available", true).order("created_at", { ascending: false })

  if (make && make !== "all") {
    query = query.eq("make", make)
  }

  if (minPrice) {
    query = query.gte("price", Number.parseInt(minPrice))
  }

  if (maxPrice && maxPrice !== "999999") {
    query = query.lte("price", Number.parseInt(maxPrice))
  }

  if (minMileage) {
    query = query.gte("mileage", Number.parseInt(minMileage))
  }

  if (maxMileage && maxMileage !== "999999") {
    query = query.lte("mileage", Number.parseInt(maxMileage))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Remove registration from public response (admin-only field)
  const publicData = (data || []).map(({ registration, ...car }) => car)

  return NextResponse.json(publicData)
}
