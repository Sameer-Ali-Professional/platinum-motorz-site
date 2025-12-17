"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export function ReviewForm() {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [customerName, setCustomerName] = useState("")
  const [carPurchased, setCarPurchased] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("reviews").insert({
        customer_name: customerName,
        rating,
        review_text: reviewText,
        car_purchased: carPurchased || null,
        is_approved: false,
      })

      if (insertError) throw insertError

      setSubmitted(true)
      setCustomerName("")
      setCarPurchased("")
      setReviewText("")
      setRating(5)

      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-black/40 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-white mb-2">Share Your Experience</h3>
        <p className="text-gray-400 mb-6">Tell us about your experience with Platinum Motorz</p>

        {submitted ? (
          <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-6 text-center">
            <div className="text-[#D4AF37] text-xl font-semibold mb-2">Thank You!</div>
            <p className="text-gray-300">Your review has been submitted and will appear once approved by our team.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="bg-black/50 border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="car" className="text-white">
                Car Purchased (Optional)
              </Label>
              <Input
                id="car"
                type="text"
                value={carPurchased}
                onChange={(e) => setCarPurchased(e.target.value)}
                placeholder="e.g., Mercedes-Benz S-Class"
                className="bg-black/50 border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Your Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "fill-transparent text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review" className="text-white">
                Your Review
              </Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                rows={6}
                className="bg-black/50 border-[#D4AF37]/20 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] resize-none"
                placeholder="Share your experience with Platinum Motorz..."
              />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C0A030] text-black font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
