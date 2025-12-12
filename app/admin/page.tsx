import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminReviewsDashboard } from "@/components/admin-reviews-dashboard"
import { AdminInventoryManager } from "@/components/admin-inventory-manager"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Platinum Motorz",
  description: "Manage reviews and inventory for Platinum Motorz",
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  async function handleLogout() {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage reviews, inventory, and Autotrader integration</p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline" className="border-[#D4AF37]/20 text-white hover:bg-[#D4AF37]/10 bg-transparent">
                Back to Site
              </Button>
            </Link>
            <form action={handleLogout}>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#D4AF37] to-[#C0A030] text-black font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
              >
                Logout
              </Button>
            </form>
          </div>
        </div>

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="bg-black/40 border border-[#D4AF37]/20 mb-8">
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-white"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-white"
            >
              Inventory & Autotrader
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <AdminReviewsDashboard />
          </TabsContent>

          <TabsContent value="inventory">
            <AdminInventoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
