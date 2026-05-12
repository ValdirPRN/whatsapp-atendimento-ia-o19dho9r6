import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { MessageSquareWarning, LayoutDashboard, History, LogOut, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

export function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Histórico', path: '/historico', icon: History },
  ]

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row w-full">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background border-b z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary w-8 h-8 flex items-center justify-center rounded-lg">
            <MessageSquareWarning className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">AgentPro</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 flex flex-col">
            <div className="flex items-center gap-2 mb-8 mt-4">
              <div className="bg-primary w-8 h-8 flex items-center justify-center rounded-lg">
                <MessageSquareWarning className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">AgentPro</span>
            </div>
            <nav className="flex-1 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="border-t pt-4 mt-auto">
              <div className="px-4 py-2 text-sm text-muted-foreground mb-2 truncate">
                {user?.name || user?.email}
              </div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={signOut}>
                <LogOut className="w-4 h-4" /> Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-background border-r min-h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary w-10 h-10 flex items-center justify-center rounded-xl shadow-sm">
            <MessageSquareWarning className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Agent<span className="font-light opacity-70">Pro</span>
          </span>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 transition-all ease-out',
                  location.pathname === item.path ? 'font-semibold shadow-sm' : '',
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="px-4 py-3 mb-2 text-sm font-medium bg-muted/50 rounded-lg truncate border border-border/50">
            {user?.name || user?.email}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors ease-out"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" /> Sair da Conta
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
