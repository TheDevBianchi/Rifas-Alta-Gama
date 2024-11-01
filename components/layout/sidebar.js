// components/layout/sidebar.js
"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Gift, Settings, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const Sidebar = () => {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const routes = [
    {
      icon: Home,
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      icon: Gift,
      href: "/dashboard/rifas",
      label: "Rifas",
    },
    {
      icon: Settings,
      href: "/dashboard/settings",
      label: "Configuración",
    },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button */ }
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden p-2"
        onClick={ () => setIsMobileOpen(!isMobileOpen) }
      >
        { isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        ) }
      </Button>

      {/* Overlay */ }
      { isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={ () => setIsMobileOpen(false) }
        />
      ) }

      {/* Sidebar */ }
      <div
        className={ cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-dark-card text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        ) }
      >
        <div className="flex h-screen flex-col space-y-4">
          <div className="flex flex-col space-y-2 p-4">
            <div className="flex h-16 items-center border-b border-dark-border px-6">
              <h1 className="text-xl font-bold">Rifas Alta Gama USA</h1>
            </div>
            <div className="space-y-2">
              { routes.map((route) => (
                <Link
                  key={ route.href }
                  href={ route.href }
                  className={ cn(
                    "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-dark-cardHover",
                    pathname === route.href
                      ? "bg-primary-600 text-white"
                      : "text-zinc-400"
                  ) }
                >
                  <route.icon className="h-5 w-5" />
                  { route.label }
                </Link>
              )) }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
