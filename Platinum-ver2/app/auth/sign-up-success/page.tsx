import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8 group">
          <span className="text-2xl font-bold text-[#D4AF37] tracking-wider">PLATINUM MOTORZ</span>
        </Link>
        <Card className="bg-black/40 backdrop-blur-sm border-[#D4AF37]/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription className="text-gray-400">
              We've sent you a confirmation email. Please click the link in the email to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-[#D4AF37] to-[#C0A030] text-black font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
