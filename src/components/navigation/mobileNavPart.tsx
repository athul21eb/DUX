"use client"


import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/mentors", label: "Mentors" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
]

export function MobileNav({setOpen}:{setOpen:Function}) {

  const pathname = usePathname()

  return (
    <div className="flex flex-col space-y-4 mt-4 ">
      {navItems.map((item) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button asChild variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start">
            <Link href={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

