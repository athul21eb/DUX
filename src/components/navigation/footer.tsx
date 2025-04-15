
import { Facebook, Instagram, Youtube } from "lucide-react"
import { Link } from "next-view-transitions"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t-4 border-primary py-12 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:flex lg:justify-between items-center gap-8">
          {/* Left Section */}
          <div className="space-y-4 text-center lg:text-left">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-primary">Dux</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Dux. All rights reserved.
            </p>
          </div>

          {/* Center Navigation */}
          <nav className="text-center">
            <ul className="flex flex-wrap justify-center lg:justify-start gap-6">
              {["Home", "Mentors", "Insights", "About Us", "Contact Us"].map((item, index) => (
                <li key={index}>
                  <Link
                    href={`/${item.toLowerCase().split(" ")[0]}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Social Icons */}
          <div className="flex justify-center lg:justify-end space-x-4">
            {[
              { icon: <Facebook />, label: "Facebook", link: "#" },
              { icon: <Instagram />, label: "Instagram", link: "#" },
              { icon: <Youtube />, label: "YouTube", link: "#" },
            ].map(({ icon, label, link }, index) => (
              <Link
                key={index}
                href={link}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-muted hover:bg-muted transition-colors"
              >
                {icon}
                <span className="sr-only">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
