import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { id } = params

  const { data, error } = await supabase.from("cars").select("*").eq("id", id).single()

  if (error) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}

