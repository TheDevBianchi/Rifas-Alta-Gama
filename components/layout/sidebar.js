// components/layout/sidebar.js
"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Gift, Settings, LogOut } from "lucide-react"

const Sidebar = () => {
  const pathname = usePathname()

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

  return (
    <div className="flex h-full flex-col space-y-4 bg-dark-card text-white">
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
                pathname === route.href ? "bg-primary-600 text-white" : "text-zinc-400"
              ) }
            >
              <route.icon className="h-5 w-5" />
              { route.label }
            </Link>
          )) }
        </div>
      </div>

    </div>
  )
}

export default Sidebar