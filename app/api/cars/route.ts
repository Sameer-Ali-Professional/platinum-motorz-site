import { NextResponse } from "next/server"
import carsData from "@/data/cars.json"

export async function GET() {
  return NextResponse.json(carsData)
}
