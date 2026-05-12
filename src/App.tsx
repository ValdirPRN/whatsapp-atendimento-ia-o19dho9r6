import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { Toaster } from '@/components/ui/sonner'
import { Login } from '@/pages/Login'
import Historico from '@/pages/Historico'
import NotFound from '@/pages/NotFound'
import { MessageSquareWarning, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Layout() {
  const { user, signOut } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary w-8 h-8 flex items-center justify-center rounded-lg shadow-sm">
              <MessageSquareWarning className="w-4 h-4 text-primary-foreground" />
            </div>
            <span>
              Agent<span className="font-light opacity-70">Pro</span>
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-sm font-medium leading-none">{user.name || user.username}</span>
              <span className="text-xs text-muted-foreground mt-1">{user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Historico />} />
            <Route path="/historico" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}
