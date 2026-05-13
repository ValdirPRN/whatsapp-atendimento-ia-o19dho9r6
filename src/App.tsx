import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import IndexPage from '@/pages/Index'
import HistoricoPage from '@/pages/Historico'
import NovoRegistro from '@/pages/NovoRegistro'
import EquipePage from '@/pages/Equipe'
import { Layout } from '@/components/Layout'

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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<IndexPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/historico" element={<HistoricoPage />} />
            <Route path="/novo-registro" element={<NovoRegistro />} />
            <Route path="/equipe" element={<EquipePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
