import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { MeshGradient } from './MeshGradient'
import { GlobalFilters } from './GlobalFilters'
import { PulsingBorder } from './PulsingBorder'

export default function Layout() {
  return (
    <SidebarProvider>
      <GlobalFilters />
      <MeshGradient />
      <PulsingBorder />

      <div className="flex min-h-screen w-full bg-transparent overflow-hidden text-foreground">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-transparent">
          <Header />
          <div className="flex-1 p-4 lg:p-8 overflow-y-auto relative animate-fade-in bg-transparent">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
