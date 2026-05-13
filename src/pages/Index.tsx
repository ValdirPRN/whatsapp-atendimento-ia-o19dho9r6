import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { getReports, updateReport, Report } from '@/services/reports'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  MessageSquareWarning,
  Clock,
  Search,
  Activity,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type FilterStatus = 'Todos' | 'Reportado' | 'Em Análise' | 'Corrigido'

export default function IndexPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('Todos')

  const loadReports = async () => {
    try {
      const data = await getReports('', '-created')
      setReports(data)
    } catch (e) {
      toast.error('Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  useRealtime('reports', () => {
    loadReports()
  })

  const handleStatusChange = async (id: string, newStatus: Report['status']) => {
    try {
      await updateReport(id, { status: newStatus })
      toast.success('Status atualizado!')
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  const stats = {
    total: reports.length,
    pendentes: reports.filter((r) => r.status === 'Reportado').length,
    analise: reports.filter((r) => r.status === 'Em Análise').length,
    alta: reports.filter((r) => r.severity === 'Alta' || r.severity === 'Crítica').length,
  }

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Todos' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
              <MessageSquareWarning className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-cyan-500 drop-shadow-md">
              Agent<span className="font-light text-cyan-400">Pro</span> Dashboard
            </h1>
          </div>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl">
            Bem-vindo(a),{' '}
            <span className="text-slate-200 font-medium">{user?.name || 'Atendente'}</span>.
            Acompanhe a performance e os registros da IA em tempo real.
          </p>
        </div>
        <Link to="/novo-registro">
          <Button className="gap-2 shadow-lg shadow-cyan-500/20 bg-cyan-600 hover:bg-cyan-500 text-white transition-all ease-out h-11 px-6">
            <Plus className="w-4 h-4" /> Novo Registro
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-lg transition-all hover:shadow-xl hover:bg-black/70 ease-out">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total de Registros</p>
              <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-lg transition-all hover:shadow-xl hover:bg-black/70 ease-out">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Pendentes (Reportado)</p>
              <h3 className="text-3xl font-bold text-white">{stats.pendentes}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-lg transition-all hover:shadow-xl hover:bg-black/70 ease-out">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Em Análise</p>
              <h3 className="text-3xl font-bold text-white">{stats.analise}</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-500/20">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-lg transition-all hover:shadow-xl hover:bg-black/70 ease-out">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Alta / Crítica</p>
              <h3 className="text-3xl font-bold text-white">{stats.alta}</h3>
            </div>
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center border border-red-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl bg-black/60 backdrop-blur-xl border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4 bg-black/20">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-white">Relatórios do Sistema</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Acompanhe o status e severidade de cada registro.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por título..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-black/50 border-white/10 text-white focus-visible:ring-cyan-500 w-full"
                />
              </div>
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/10 w-full sm:w-auto overflow-x-auto">
                {(['Todos', 'Reportado', 'Em Análise', 'Corrigido'] as FilterStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap',
                        statusFilter === status
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-white/5',
                      )}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-400 animate-pulse">
              Carregando dados...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-12 h-12 text-slate-600 mb-4 opacity-70" />
              <p className="text-lg font-medium text-slate-300">Nenhum registro encontrado.</p>
              <p className="text-sm mt-1">
                Tente ajustar seus filtros de busca ou verificar outras categorias.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/40 border-b border-white/10 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Título & Data</th>
                    <th className="px-6 py-4 font-medium">Categoria</th>
                    <th className="px-6 py-4 font-medium">Severidade</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="bg-transparent hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="font-medium text-white text-base max-w-[200px] sm:max-w-xs truncate"
                          title={report.title}
                        >
                          {report.title}
                        </div>
                        <div className="text-slate-500 text-xs mt-1">
                          {new Date(report.created).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50 text-xs whitespace-nowrap">
                          {report.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            report.severity === 'Alta' || report.severity === 'Crítica'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className={cn(
                            'font-medium shadow-none',
                            report.severity === 'Alta' || report.severity === 'Crítica'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : report.severity === 'Média'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                          )}
                        >
                          {report.severity}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full',
                              report.status === 'Reportado'
                                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                : report.status === 'Em Análise'
                                  ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]'
                                  : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
                            )}
                          />
                          <span className="text-slate-300 font-medium">{report.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end min-w-[140px]">
                          <Select
                            value={report.status}
                            onValueChange={(v: any) => handleStatusChange(report.id, v)}
                          >
                            <SelectTrigger className="h-8 text-xs bg-black/40 border-white/10 text-slate-200 focus:ring-cyan-500 w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 border-white/10 text-white">
                              <SelectItem value="Reportado">Reportado</SelectItem>
                              <SelectItem value="Em Análise">Em Análise</SelectItem>
                              <SelectItem value="Corrigido">Corrigido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
