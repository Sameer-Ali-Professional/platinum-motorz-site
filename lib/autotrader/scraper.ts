import { chromium, Browser, Page } from "playwright"
import chromiumPkg from "@sparticuz/chromium"

export interface AutotraderListing {
  autotrader_id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type?: string
  transmission?: string
  body_type?: string
  engine_size?: string
  color?: string
  doors?: number
  description?: string
  features?: string[]
  images: string[] // URLs in DOM order
  listing_url: string
}

export class AutotraderScraper {
  private browser: Browser | null = null
  private readonly dealerUrl: string

  constructor(dealerUrl: string) {
    this.dealerUrl = dealerUrl
  }

  async initialize() {
    try {
      // Check if we're in a serverless environment (Vercel)
      const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
      
      if (isServerless) {
        // Use serverless-compatible Chromium
        this.browser = await chromium.launch({
          headless: true,
          args: chromiumPkg.args,
          executablePath: await chromiumPkg.executablePath(),
        })
      } else {
        // Use regular Chromium for local/dev
        this.browser = await chromium.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        })
      }
    } catch (error) {
      throw new Error(
        `Failed to launch browser: ${error instanceof Error ? error.message : "Unknown error"}. Playwright may not be installed or available in this environment.`
      )
    }
  }

  async scrapeAllListings(): Promise<AutotraderListing[]> {
    if (!this.browser) {
      await this.initialize()
    }

    const page = await this.browser!.newPage()
    const listings: AutotraderListing[] = []

    try {
      // Set viewport and user agent
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.setExtraHTTPHeaders({
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      })

      // Navigate to dealer page
      console.log(`Navigating to ${this.dealerUrl}...`)
      await page.goto(this.dealerUrl, { waitUntil: "domcontentloaded", timeout: 30000 })

      // Wait a bit for dynamic content
      await page.waitForTimeout(3000)

      // Try multiple selector strategies
      let listingElements: any[] = []

      // Strategy 1: Modern Autotrader selectors
      try {
        listingElements = await page.$$('[data-testid="search-listing"], [data-testid="advert-card"]')
        if (listingElements.length === 0) {
          // Strategy 2: Class-based selectors
          listingElements = await page.$$(
            '.search-listing, .at-listing-card, [class*="listing-card"], [class*="advert-card"]'
          )
        }
        if (listingElements.length === 0) {
          // Strategy 3: Generic listing containers
          listingElements = await page.$$('article, [role="article"], .listing, [class*="listing"]')
        }
      } catch (error) {
        console.warn("Error finding listing elements:", error)
      }

      console.log(`Found ${listingElements.length} listing elements`)

      // Extract data from each listing
      for (let i = 0; i < listingElements.length; i++) {
        try {
          const listing = await this.extractListingData(page, listingElements[i], i)
          if (listing) {
            listings.push(listing)
          }
        } catch (error) {
          console.error(`Error extracting listing ${i}:`, error)
          continue
        }
      }

      // If no listings found, try fallback approach
      if (listings.length === 0) {
        console.log("Trying fallback scrape method...")
        const fallbackListings = await this.fallbackScrape(page)
        listings.push(...fallbackListings)
      }

      // If still no listings, try extracting from individual car detail pages
      if (listings.length === 0) {
        console.log("Trying to extract from car detail links...")
        const detailListings = await this.scrapeFromDetailLinks(page)
        listings.push(...detailListings)
      }
    } catch (error) {
      console.error("Scraping error:", error)
      throw error
    } finally {
      await page.close()
    }

    return listings
  }

  private async scrapeFromDetailLinks(page: Page): Promise<AutotraderListing[]> {
    const listings: AutotraderListing[] = []

    try {
      // Find all links to car detail pages
      const carLinks = await page.$$eval('a[href*="/car-details/"]', (links) => {
        return Array.from(links)
          .map((link) => ({
            href: link.getAttribute("href") || "",
            text: link.textContent?.trim() || "",
          }))
          .filter((link) => link.href.includes("/car-details/"))
          .slice(0, 20) // Limit to first 20 to avoid timeout
      })

      for (const link of carLinks) {
        try {
          const match = link.href.match(/\/car-details\/([^\/\?]+)/)
          if (!match) continue

          const autotraderId = match[1]
          const fullUrl = link.href.startsWith("http") ? link.href : `https://www.autotrader.co.uk${link.href}`

          // Extract basic info from link text
          const titleMatch = link.text.match(/(\d{4})\s+(.+?)\s+(.+)/)
          if (titleMatch) {
            listings.push({
              autotrader_id: autotraderId,
              make: titleMatch[2].trim(),
              model: titleMatch[3].trim(),
              year: parseInt(titleMatch[1]),
              price: 0,
              mileage: 0,
              images: [],
              listing_url: fullUrl,
            })
          }
        } catch (error) {
          console.error("Error processing detail link:", error)
          continue
        }
      }
    } catch (error) {
      console.error("Error in fallback detail link scrape:", error)
    }

    return listings
  }

  private async extractListingData(page: Page, element: any, index: number): Promise<AutotraderListing | null> {
    try {
      // Extract basic info
      const title = await element.evaluate((el: Element) => {
        const titleEl = el.querySelector('[data-testid="advert-title"], h2, h3, [class*="title"]')
        return titleEl?.textContent?.trim() || ""
      })

      if (!title) return null

      // Parse make, model, year from title (e.g., "2022 Mercedes-Benz S-Class")
      const titleMatch = title.match(/(\d{4})\s+(.+?)\s+(.+)/)
      if (!titleMatch) return null

      const year = parseInt(titleMatch[1])
      const make = titleMatch[2].trim()
      const model = titleMatch[3].trim()

      // Extract price
      const priceText = await element.evaluate((el: Element) => {
        const priceEl = el.querySelector('[data-testid="price"], [class*="price"]')
        return priceEl?.textContent?.trim() || ""
      })

      const price = this.parsePrice(priceText)

      // Extract mileage
      const mileageText = await element.evaluate((el: Element) => {
        const mileageEl = el.querySelector('[data-testid="mileage"], [class*="mileage"]')
        return mileageEl?.textContent?.trim() || ""
      })

      const mileage = this.parseMileage(mileageText)

      // Extract autotrader ID from link or data attribute
      const autotraderId = await element.evaluate((el: Element) => {
        const link = el.querySelector("a[href*='/car-details']")
        if (link) {
          const href = link.getAttribute("href") || ""
          const match = href.match(/\/car-details\/([^\/]+)/)
          return match ? match[1] : null
        }
        return el.getAttribute("data-ad-id") || el.getAttribute("data-listing-id") || null
      })

      if (!autotraderId) return null

      // Extract listing URL
      const listingUrl = await element.evaluate((el: Element) => {
        const link = el.querySelector("a[href*='/car-details']")
        if (link) {
          const href = link.getAttribute("href") || ""
          return href.startsWith("http") ? href : `https://www.autotrader.co.uk${href}`
        }
        return null
      })

      // Extract images in DOM order (preserve order from page)
      const images = await element.evaluate((el: Element) => {
        const imgElements = Array.from(el.querySelectorAll("img"))
        const imageUrls: string[] = []

        imgElements.forEach((img) => {
          // Try multiple attributes for image source
          const src =
            img.getAttribute("data-src") ||
            img.getAttribute("data-lazy-src") ||
            img.getAttribute("src") ||
            ""

          if (src && !src.includes("placeholder") && !src.includes("logo") && !src.includes("icon")) {
            let fullUrl = src
            if (!src.startsWith("http")) {
              fullUrl = src.startsWith("//") ? `https:${src}` : `https://www.autotrader.co.uk${src}`
            }

            // Clean up URL (remove query params that might be for sizing)
            const cleanUrl = fullUrl.split("?")[0]

            if (!imageUrls.includes(cleanUrl) && cleanUrl.includes("autotrader")) {
              imageUrls.push(cleanUrl)
            }
          }
        })

        return imageUrls
      })

      // Extract additional details
      const details = await element.evaluate((el: Element) => {
        const detailsEl = el.querySelector('[data-testid="specifications"], [class*="spec"], [class*="details"]')
        const text = detailsEl?.textContent || ""
        return text
      })

      const fuelType = this.extractFuelType(details)
      const transmission = this.extractTransmission(details)
      const bodyType = this.extractBodyType(details)

      return {
        autotrader_id: autotraderId,
        make,
        model,
        year,
        price,
        mileage,
        fuel_type: fuelType,
        transmission,
        body_type: bodyType,
        images: images.length > 0 ? images : [],
        listing_url: listingUrl || `https://www.autotrader.co.uk/car-details/${autotraderId}`,
      }
    } catch (error) {
      console.error("Error extracting listing data:", error)
      return null
    }
  }

  private async fallbackScrape(page: Page): Promise<AutotraderListing[]> {
    // Fallback: Try to extract from page structure
    const listings: AutotraderListing[] = []

    try {
      // Get all links to car details
      const carLinks = await page.$$eval('a[href*="/car-details"]', (links) => {
        return links.map((link) => ({
          href: link.getAttribute("href") || "",
          text: link.textContent?.trim() || "",
        }))
      })

      for (const link of carLinks) {
        const match = link.href.match(/\/car-details\/([^\/]+)/)
        if (match) {
          const autotraderId = match[1]
          const titleMatch = link.text.match(/(\d{4})\s+(.+?)\s+(.+)/)

          if (titleMatch) {
            listings.push({
              autotrader_id: autotraderId,
              make: titleMatch[2].trim(),
              model: titleMatch[3].trim(),
              year: parseInt(titleMatch[1]),
              price: 0, // Will need to fetch from detail page
              mileage: 0,
              images: [],
              listing_url: link.href.startsWith("http") ? link.href : `https://www.autotrader.co.uk${link.href}`,
            })
          }
        }
      }
    } catch (error) {
      console.error("Fallback scrape error:", error)
    }

    return listings
  }

  private parsePrice(priceText: string): number {
    const cleaned = priceText.replace(/[£,\s]/g, "")
    return parseInt(cleaned) || 0
  }

  private parseMileage(mileageText: string): number {
    const cleaned = mileageText.replace(/[,\s]/g, "").replace(/miles?/i, "")
    return parseInt(cleaned) || 0
  }

  private extractFuelType(text: string): string | undefined {
    const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"]
    for (const fuel of fuelTypes) {
      if (text.toLowerCase().includes(fuel.toLowerCase())) {
        return fuel
      }
    }
    return undefined
  }

  private extractTransmission(text: string): string | undefined {
    if (text.toLowerCase().includes("automatic") || text.toLowerCase().includes("auto")) {
      return "Automatic"
    }
    if (text.toLowerCase().includes("manual")) {
      return "Manual"
    }
    return undefined
  }

  private extractBodyType(text: string): string | undefined {
    const bodyTypes = ["Saloon", "Estate", "Hatchback", "SUV", "Coupe", "Convertible", "MPV"]
    for (const body of bodyTypes) {
      if (text.toLowerCase().includes(body.toLowerCase())) {
        return body
      }
    }
    return undefined
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

