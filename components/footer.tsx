import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">PLATINUM MOTORZ</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner for premium luxury vehicles in Oldham
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Nile Mill A, Cotswold Avenue</p>
              <p>Chadderton, Oldham</p>
              <p>OL9 8PJ, England</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Stock", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+447918082186"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +44 7918 082186
                </a>
              </li>
              <li>
                <a
                  href="mailto:platinummotorz1@outlook.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                >
                  platinummotorz1@outlook.com
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="Visit our Twitter page"
              >
                <Twitter className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {currentYear} Platinum Motorz. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
