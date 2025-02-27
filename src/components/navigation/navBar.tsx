"use client"

import { useState, useEffect } from "react"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { MainNav } from "./mainNavPart"
import { ThemeToggle } from "../ui/ThemeToggle"
import { UserNav } from "./userNavPart"
import { VisuallyHidden } from "../ui/vishually-hidden"
import { MobileNav } from "./mobileNavPart"
import { Link } from "next-view-transitions"

export function NavBar() {
  const pathname = usePathname()
  const {  status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-md",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className=" flex justify-between h-16 items-center px-4 md:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-primary font-bold text-2xl md:text-3xl">DUX</span>
        </Link>
        <MainNav className="hidden md:flex flex-1 justify-center" />
        <div className="flex  items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {status === "authenticated" ? (
              <UserNav />
            ) : status === "unauthenticated" ? (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            ) :  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />}
            <Sheet >
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle>
                  <VisuallyHidden>Navigation Menu</VisuallyHidden>
                </SheetTitle>
                <MobileNav />
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

