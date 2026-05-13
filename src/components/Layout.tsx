import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  MessageSquareWarning,
  LayoutDashboard,
  History,
  LogOut,
  Menu,
  PlusCircle,
  Users,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { MeshGradient } from '@/components/MeshGradient'

export function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Novo Registro', path: '/novo-registro', icon: PlusCircle },
    { name: 'Histórico', path: '/historico', icon: History },
    { name: 'Equipe', path: '/equipe', icon: Users },
  ]

  return (
    <>
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
        <MeshGradient />
      </div>
      <div className="min-h-screen flex flex-col md:flex-row w-full relative z-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-black/40 backdrop-blur-xl border-b border-white/10 z-10 sticky top-0 text-white">
          <div className="flex items-center gap-2">
            <div className="bg-primary w-8 h-8 flex items-center justify-center rounded-lg">
              <MessageSquareWarning className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg">AgentPro</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 flex flex-col bg-black/90 backdrop-blur-2xl border-white/10 text-white"
            >
              <div className="flex items-center gap-2 mb-8 mt-4">
                <div className="bg-primary w-8 h-8 flex items-center justify-center rounded-lg">
                  <MessageSquareWarning className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-lg">AgentPro</span>
              </div>
              <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  if (item.path === '/novo-registro') {
                    return (
                      <Link key={item.path} to={item.path} className="my-2">
                        <Button
                          className={cn(
                            'w-full justify-start gap-3 transition-all ease-out shadow-lg',
                            isActive
                              ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                              : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 border border-cyan-500/20',
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </Button>
                      </Link>
                    )
                  }
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 transition-all ease-out text-slate-300 hover:text-white hover:bg-white/10',
                          isActive ? 'font-semibold bg-white/10 text-white shadow-sm' : '',
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </Button>
                    </Link>
                  )
                })}
              </nav>
              <div className="border-t border-white/10 pt-4 mt-auto">
                <div className="px-4 py-2 text-sm text-white/60 mb-2 truncate">
                  {user?.name || user?.email}
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4" /> Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-black/40 backdrop-blur-xl border-r border-white/10 min-h-screen sticky top-0 text-white">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary w-10 h-10 flex items-center justify-center rounded-xl shadow-lg">
              <MessageSquareWarning className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Agent<span className="font-light text-cyan-400">Pro</span>
            </span>
          </div>
          <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              if (item.path === '/novo-registro') {
                return (
                  <Link key={item.path} to={item.path} className="my-2">
                    <Button
                      className={cn(
                        'w-full justify-start gap-3 transition-all ease-out shadow-lg hover:shadow-cyan-500/20',
                        isActive
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 border border-cyan-500/20',
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              }
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-3 transition-all ease-out text-slate-300 hover:text-white hover:bg-white/10',
                      isActive ? 'font-semibold bg-white/10 text-white shadow-sm' : '',
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <div className="px-4 py-3 mb-2 text-sm font-medium bg-black/40 rounded-lg truncate border border-white/10 text-white/80">
              {user?.name || user?.email}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors ease-out"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" /> Sair da Conta
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out z-10 relative">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </>
  )
}
