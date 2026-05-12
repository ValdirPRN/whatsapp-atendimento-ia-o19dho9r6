import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import NovoRegistro from '@/pages/NovoRegistro'
import Historico from '@/pages/Historico'
import ErroDetalhes from '@/pages/ErroDetalhes'
import NotFound from '@/pages/NotFound'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { Login } from '@/pages/Login'

function PrivateRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/novo-registro" element={<NovoRegistro />} />
              <Route path="/historico" element={<Historico />} />
              <Route path="/erro/:id" element={<ErroDetalhes />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
