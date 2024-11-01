import { AuthGuard } from '@/components/auth/auth-guard'
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard de la aplicación de rifas',
}

export default function Layout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthGuard>
        <div className="h-screen overflow-hidden">
          <div className="flex h-full">
            <div className="hidden w-72 shrink-0 md:block">
              <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto">
              <Navbar />
              <div className="p-6">
                { children }
              </div>
            </main>
          </div>
        </div>
      </AuthGuard>
    </ThemeProvider>
  )
}