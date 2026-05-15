import { useState, useEffect } from 'react'
import { getReports } from '@/services/reports'
import { useRealtime } from '@/hooks/use-realtime'
import { ReportDevModal } from '@/components/ReportDevModal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Terminal, Filter, Clock, AlertTriangle, CheckCircle2, User } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ReportRecord } from '@/lib/types'

export default function DashboardDevPage() {
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null)

  const loadReports = async () => {
    try {
      const data = await getReports('', '-created')
      setReports(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  useRealtime('reports', () => {
    loadReports()
  })

  const filteredReports = reports.filter(
    (r) => filterStatus === 'todos' || r.status === filterStatus,
  )

  const getBadge = (status: string) => {
    if (status === 'Problema resolvido' || status === 'Concluído') {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-semibold shadow-none whitespace-nowrap">
          <CheckCircle2 className="w-3 h-3 mr-1" /> {status}
        </Badge>
      )
    }
    if (status === 'Problema não corrigido') {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-semibold shadow-none whitespace-nowrap">
          <AlertTriangle className="w-3 h-3 mr-1" /> {status}
        </Badge>
      )
    }
    if (status === 'Aguardando validação') {
      return (
        <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-none whitespace-nowrap">
          {status}
        </Badge>
      )
    }
    if (status === 'Em análise') {
      return (
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-none whitespace-nowrap">
          <Clock className="w-3 h-3 mr-1 animate-pulse" /> {status}
        </Badge>
      )
    }
    return (
      <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-none whitespace-nowrap">
        {status || 'Reportado'}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-md">
            <Terminal className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Painel Dev</h1>
            <p className="text-slate-400 text-sm mt-1">
              Gerencie, analise e atualize os status dos chamados da IA.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[220px] bg-black/40 border-white/10 text-white h-10 focus:ring-cyan-500">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800 text-white">
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="Reportado">Reportado</SelectItem>
              <SelectItem value="Em análise">Em análise</SelectItem>
              <SelectItem value="Problema resolvido">Problema resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Terminal className="w-16 h-16 mb-6 opacity-50 text-cyan-500" />
            <p className="text-xl font-medium text-white mb-2">Nenhum chamado encontrado</p>
            <p className="text-slate-400 text-center max-w-md">
              Não há relatos correspondentes ao filtro atual.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((r) => (
            <Card
              key={r.id}
              className="bg-black/40 border-white/10 backdrop-blur-xl shadow-xl shadow-black/40 hover:bg-white/5 transition-colors cursor-pointer flex flex-col"
              onClick={() => setSelectedReport(r)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <CardTitle className="text-lg text-white font-semibold line-clamp-2 leading-tight">
                    {r.title || 'Sem título'}
                  </CardTitle>
                </div>
                <div>{getBadge(r.status)}</div>
                <div className="text-sm text-slate-400 mt-4 line-clamp-3">
                  {r.context || r.actual_behavior}
                </div>
              </CardHeader>
              <CardContent className="mt-auto pt-4 flex flex-col gap-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate max-w-[120px]">
                      {r.expand?.user_id?.name || r.expand?.user_id?.email || 'Sistema'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{format(new Date(r.created), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ReportDevModal
        report={selectedReport}
        open={!!selectedReport}
        onOpenChange={(o) => !o && setSelectedReport(null)}
      />
    </div>
  )
}
