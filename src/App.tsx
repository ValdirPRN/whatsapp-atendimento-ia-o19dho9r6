import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import NovoRegistro from './pages/NovoRegistro'
import Historico from './pages/Historico'
import ErroDetalhes from './pages/ErroDetalhes'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/novo-registro" element={<NovoRegistro />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/erro/:id" element={<ErroDetalhes />} />
          <Route
            path="/configuracoes"
            element={
              <div className="p-8 text-center text-muted-foreground">
                Página de configurações em construção.
              </div>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
