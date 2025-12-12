"use client"

import { useEffect, useState } from "react"
import { Star, Quote } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Review {
  id: string
  customer_name: string
  rating: number
  review_text: string
  car_purchased: string | null
  created_at: string
}

export function ReviewsDisplay() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (!error && data) {
        setReviews(data)
      }
      setIsLoading(false)
    }

    fetchReviews()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black/40 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No reviews yet. Be the first to share your experience!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-black/40 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6 hover:border-[#D4AF37]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-8 h-8 text-[#D4AF37]" />
            <div className="flex-1">
              <div className="flex gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-transparent text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-4 leading-relaxed">{review.review_text}</p>

          <div className="border-t border-[#D4AF37]/20 pt-4">
            <p className="text-white font-semibold">{review.customer_name}</p>
            {review.car_purchased && <p className="text-[#D4AF37] text-sm mt-1">{review.car_purchased}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
