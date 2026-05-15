import { useState, useEffect } from 'react'
import { getReports } from '@/services/reports'
import { useRealtime } from '@/hooks/use-realtime'
import { ReportDevModal } from '@/components/ReportDevModal'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Terminal, Filter, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
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
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-semibold shadow-none">
          <CheckCircle2 className="w-3 h-3 mr-1" /> {status}
        </Badge>
      )
    }
    if (status === 'Problema não corrigido') {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-semibold shadow-none">
          <AlertTriangle className="w-3 h-3 mr-1" /> {status}
        </Badge>
      )
    }
    if (status === 'Aguardando validação') {
      return (
        <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-none">
          {status}
        </Badge>
      )
    }
    if (status === 'Em análise') {
      return (
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-none">
          <Clock className="w-3 h-3 mr-1 animate-pulse" /> {status}
        </Badge>
      )
    }
    return (
      <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-none">
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
              <SelectItem value="Aguardando validação">Aguardando validação</SelectItem>
              <SelectItem value="Problema resolvido">Problema resolvido</SelectItem>
              <SelectItem value="Problema não corrigido">Problema não corrigido</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-xl shadow-black/40">
        <CardHeader className="border-b border-white/5 bg-black/20 pb-4">
          <CardTitle className="text-xl text-white">Fila de Chamados</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Data</TableHead>
                <TableHead className="text-slate-400 font-medium">Título</TableHead>
                <TableHead className="text-slate-400 font-medium">Reportado por</TableHead>
                <TableHead className="text-slate-400 font-medium">Severidade</TableHead>
                <TableHead className="text-slate-400 font-medium text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((r) => (
                <TableRow
                  key={r.id}
                  className="border-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => setSelectedReport(r)}
                >
                  <TableCell className="text-slate-300 text-sm whitespace-nowrap">
                    {format(new Date(r.created), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-white font-medium max-w-[200px] truncate">
                    {r.title || 'Sem título'}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {r.expand?.user_id?.name || r.expand?.user_id?.email || 'Sistema'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-white/10 text-slate-300 shadow-none bg-black/50"
                    >
                      {r.severity || 'Média'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">{getBadge(r.status)}</TableCell>
                </TableRow>
              ))}
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    Nenhum chamado encontrado para este filtro.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReportDevModal
        report={selectedReport}
        open={!!selectedReport}
        onOpenChange={(o) => !o && setSelectedReport(null)}
      />
    </div>
  )
}
