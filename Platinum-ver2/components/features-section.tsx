import { Card } from "@/components/ui/card"
import { Award, DollarSign, Shield } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Quality Cars",
    description: "Hand-picked premium vehicles inspected to the highest standards",
  },
  {
    icon: DollarSign,
    title: "Affordable Finance",
    description: "Flexible financing options tailored to your budget and needs",
  },
  {
    icon: Shield,
    title: "Trusted Service",
    description: "Exceptional customer care and comprehensive after-sales support",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="bg-card border-border hover:border-primary/50 transition-all duration-300 p-8 group hover:scale-105"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
