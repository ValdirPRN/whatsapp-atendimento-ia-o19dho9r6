import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import AuthPage from '@/pages/Auth'
import IndexPage from '@/pages/Index'
import NovoRegistro from '@/pages/NovoRegistro'
import HistoricoPage from '@/pages/Historico'
import EquipePage from '@/pages/Equipe'
import DashboardDevPage from '@/pages/DashboardDev'
import { Layout } from '@/components/Layout'
import { Toaster } from 'sonner'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">
        Carregando AgentPro...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function RoleBasedRedirect() {
  const { user } = useAuth()
  if (user?.role === 'dev') return <Navigate to="/dashboard-dev" replace />
  return <IndexPage />
}

function DevRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user?.role !== 'dev') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route
              path="/dashboard-dev"
              element={
                <DevRoute>
                  <DashboardDevPage />
                </DevRoute>
              }
            />
            <Route path="/novo-registro" element={<NovoRegistro />} />
            <Route path="/historico" element={<HistoricoPage />} />
            <Route path="/equipe" element={<EquipePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster theme="dark" position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}
