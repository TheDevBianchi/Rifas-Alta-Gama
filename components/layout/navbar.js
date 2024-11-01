// components/layout/navbar.js
"use client"
import { Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

const Navbar = () => {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex h-16 items-center justify-between border-b border-dark-border px-6">
      <div className="flex items-center gap-x-4">
        <h1 className="text-xl font-bold">Bienvenido, Yur</h1>
      </div>
      <div className="flex items-center gap-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              { theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              ) }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={ () => setTheme("light") }>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={ () => setTheme("dark") }>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={ () => setTheme("system") }>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navbar