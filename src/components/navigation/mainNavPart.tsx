"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Link } from "next-view-transitions"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/mentors", label: "Mentors" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
]

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "relative flex items-center justify-center space-x-8 px-6 py-4 w-full",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-6  lg:space-x-10">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative lg:px-2 py-2 md:text-md lg:text-lg font-medium transition-colors hover:text-blue-500",
              pathname === item.href ? "text-blue-500" : "text-foreground",
            )}
          >
            {item.label}

            {pathname === item.href && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500"
                layoutId="navbar-active"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            {pathname !== item.href && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 w-full bg-transparent"
                initial={{ scaleX: 0 }}
                whileHover={{
                  scaleX: 1,
                  backgroundColor: "rgb(229 231 235)"
                }}
                transition={{ duration: 0.2 }}
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}