import { Shield, Award, Users, TrendingUp } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Platinum Motorz | Premium Car Dealership in Oldham",
  description:
    "Learn about Platinum Motorz, Oldham's trusted luxury car dealership. Over 15 years of experience providing premium vehicles with exceptional service and transparent pricing.",
  keywords: "about Platinum Motorz, luxury car dealer Oldham, premium vehicles, car dealership history",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            About <span className="text-primary">Platinum Motorz</span>
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 leading-relaxed text-pretty">
            Where luxury meets excellence in automotive retail
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              At Platinum Motorz, we are dedicated to providing an unparalleled luxury car buying experience. Our
              mission is to connect discerning clients with the finest vehicles on the market, backed by exceptional
              service and unwavering professionalism.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              With years of expertise in the luxury automotive industry, we pride ourselves on our carefully curated
              selection of premium vehicles, transparent pricing, and commitment to customer satisfaction. Every car in
              our showroom represents the pinnacle of automotive engineering and design.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose <span className="text-primary">Platinum Motorz</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Trust & Integrity</h3>
              <p className="text-gray-400 leading-relaxed">
                Every vehicle is thoroughly inspected and comes with complete documentation and history.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Quality</h3>
              <p className="text-gray-400 leading-relaxed">
                We stock only the finest luxury vehicles from the world's most prestigious manufacturers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Service</h3>
              <p className="text-gray-400 leading-relaxed">
                Our knowledgeable team provides personalized guidance throughout your buying journey.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Flexible Finance</h3>
              <p className="text-gray-400 leading-relaxed">
                Competitive financing options tailored to your needs with transparent terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 mb-16">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">15+</div>
                <div className="text-gray-300 text-lg">Years Experience</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-300 text-lg">Happy Clients</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">100+</div>
                <div className="text-gray-300 text-lg">Premium Vehicles</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
