import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Plus, MessageSquareWarning } from 'lucide-react'

export default function IndexPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center">
          <div className="bg-cyan-500/10 p-6 rounded-3xl border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <MessageSquareWarning className="w-16 h-16 text-cyan-400" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-cyan-500 drop-shadow-md">
            Agent<span className="font-light text-cyan-400">Pro</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-2xl max-w-2xl mx-auto leading-relaxed">
            Bem-vindo(a),{' '}
            <span className="text-slate-200 font-medium">{user?.name || 'Atendente'}</span>.
            <br />
            Utilize esta plataforma para relatar falhas e anomalias na inteligência artificial de
            forma organizada e eficiente.
          </p>
        </div>

        <div className="pt-8">
          <Link to="/novo-registro">
            <Button
              size="lg"
              className="gap-3 shadow-xl shadow-cyan-500/20 bg-cyan-600 hover:bg-cyan-500 text-white transition-all ease-out h-14 px-8 text-lg rounded-xl font-medium"
            >
              <Plus className="w-6 h-6" /> Fazer Novo Registro
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
