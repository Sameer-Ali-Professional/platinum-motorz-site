import type { Metadata } from "next"
import { ReviewForm } from "@/components/review-form"
import { ReviewsDisplay } from "@/components/reviews-display"

export const metadata: Metadata = {
  title: "Customer Reviews | Platinum Motorz - Luxury Car Dealership Oldham",
  description:
    "Read reviews from our satisfied customers and share your experience with Platinum Motorz, your trusted luxury car dealership in Oldham.",
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Customer Reviews</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See what our customers have to say about their experience with Platinum Motorz
          </p>
        </div>

        {/* Reviews Display */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What Our Customers Say</h2>
          <ReviewsDisplay />
        </div>

        {/* Review Form */}
        <div className="mt-20">
          <ReviewForm />
        </div>
      </div>
    </div>
  )
}
