/**
 * Verification script to check if Autotrader ingest setup is complete
 * Run with: npx tsx scripts/verify-setup.ts
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables")
  console.log("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifySetup() {
  console.log("🔍 Verifying Autotrader Ingest Setup...\n")

  // Check 1: Storage bucket exists
  console.log("1. Checking storage bucket...")
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error) {
      console.log("   ⚠️  Cannot check buckets (may need admin access)")
      console.log("   → Please verify manually in Supabase dashboard")
    } else {
      const carImagesBucket = buckets?.find((b) => b.id === "car-images")
      if (carImagesBucket) {
        console.log("   ✅ Storage bucket 'car-images' exists")
      } else {
        console.log("   ❌ Storage bucket 'car-images' NOT found")
        console.log("   → Run: scripts/005_create_storage_bucket.sql")
      }
    }
  } catch (error) {
    console.log("   ⚠️  Error checking buckets:", error)
  }

  // Check 2: Sync columns exist
  console.log("\n2. Checking database columns...")
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("last_synced_at, sync_source")
      .limit(1)

    if (error) {
      if (error.message.includes("column") || error.message.includes("does not exist")) {
        console.log("   ❌ Sync columns NOT found")
        console.log("   → Run: scripts/006_add_image_ordering.sql")
      } else {
        console.log("   ⚠️  Error checking columns:", error.message)
      }
    } else {
      console.log("   ✅ Sync columns exist (last_synced_at, sync_source)")
    }
  } catch (error) {
    console.log("   ⚠️  Error:", error)
  }

  // Check 3: Dependencies
  console.log("\n3. Checking dependencies...")
  try {
    const { execSync } = require("child_process")
    try {
      execSync("npx playwright --version", { stdio: "ignore" })
      console.log("   ✅ Playwright installed")
    } catch {
      console.log("   ❌ Playwright NOT installed")
      console.log("   → Run: npx playwright install chromium")
    }
  } catch {
    console.log("   ⚠️  Cannot verify Playwright")
  }

  console.log("\n✅ Verification complete!")
  console.log("\n📝 Next steps:")
  console.log("   1. Run SQL scripts in Supabase dashboard (if not done)")
  console.log("   2. Test sync from /admin dashboard")
  console.log("   3. Check /stock page for synced cars")
}

verifySetup().catch(console.error)

