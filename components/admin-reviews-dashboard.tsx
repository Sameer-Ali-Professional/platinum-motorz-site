"use client"

import { useEffect, useState } from "react"
import { Star, Check, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface Review {
  id: string
  customer_name: string
  rating: number
  review_text: string
  car_purchased: string | null
  is_approved: boolean
  created_at: string
}

export function AdminReviewsDashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all")

  const fetchReviews = async () => {
    setIsLoading(true)
    const supabase = createClient()

    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false })

    if (filter === "pending") {
      query = query.eq("is_approved", false)
    } else if (filter === "approved") {
      query = query.eq("is_approved", true)
    }

    const { data, error } = await query

    if (!error && data) {
      setReviews(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const handleApprove = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id)

    if (!error) {
      fetchReviews()
    }
  }

  const handleUnapprove = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("reviews").update({ is_approved: false }).eq("id", id)

    if (!error) {
      fetchReviews()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    const supabase = createClient()
    const { error } = await supabase.from("reviews").delete().eq("id", id)

    if (!error) {
      fetchReviews()
    }
  }

  const pendingCount = reviews.filter((r) => !r.is_approved).length
  const approvedCount = reviews.filter((r) => r.is_approved).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/40 backdrop-blur-sm border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-white">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#D4AF37]">{reviews.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-white">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-400">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-white">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-400">{approvedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/40 backdrop-blur-sm border-[#D4AF37]/20">
        <CardHeader>
          <CardTitle className="text-white">Manage Reviews</CardTitle>
          <CardDescription className="text-gray-400">Approve, unapprove, or delete customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#C0A030] text-black"
                  : "border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10"
              }
            >
              All ({reviews.length})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              className={
                filter === "pending"
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#C0A030] text-black"
                  : "border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10"
              }
            >
              Pending ({pendingCount})
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              onClick={() => setFilter("approved")}
              className={
                filter === "approved"
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#C0A030] text-black"
                  : "border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10"
              }
            >
              Approved ({approvedCount})
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-black/40 border border-[#D4AF37]/10 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No reviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-black/40 border border-[#D4AF37]/10 rounded-lg p-6 hover:border-[#D4AF37]/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">{review.customer_name}</h3>
                        {review.is_approved ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "fill-transparent text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      {review.car_purchased && <p className="text-[#D4AF37] text-sm mb-2">{review.car_purchased}</p>}
                    </div>
                    <div className="flex gap-2">
                      {review.is_approved ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnapprove(review.id)}
                          className="border-[#D4AF37]/20 text-orange-400 hover:bg-orange-500/10"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Unapprove
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          className="bg-gradient-to-r from-[#D4AF37] to-[#C0A030] text-black hover:shadow-lg hover:shadow-[#D4AF37]/50"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(review.id)}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{review.review_text}</p>
                  <p className="text-gray-500 text-sm mt-4">
                    Submitted: {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
