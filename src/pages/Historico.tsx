import { useState, useEffect } from 'react'
import { getReports, Report } from '@/services/reports'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, History as HistoryIcon, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HistoricoPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const loadReports = async () => {
    try {
      const data = await getReports('', '-created')
      setReports(data)
    } catch (e) {
      console.error(e)
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

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.actual_behavior.toLowerCase().includes(search.toLowerCase()) ||
      r.expected_behavior.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'Todos' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico Geral</h1>
        <p className="text-muted-foreground mt-1">
          Busque e analise todos os relatórios já registrados no sistema.
        </p>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="bg-muted/30 pb-4 border-b rounded-t-xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors ease-out" />
              <Input
                placeholder="Buscar por título ou descrição da falha..."
                className="pl-9 bg-background shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-56">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background shadow-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Status</SelectItem>
                  <SelectItem value="Reportado">Reportado</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Corrigido">Corrigido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {loading ? (
              <div className="p-12 text-center text-muted-foreground animate-pulse flex flex-col items-center">
                <HistoryIcon className="w-10 h-10 mb-4 opacity-20" />
                Carregando histórico completo...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center animate-in fade-in ease-out">
                <Search className="w-10 h-10 mb-4 opacity-20" />
                Nenhum relatório encontrado para os filtros atuais.
              </div>
            ) : (
              filtered.map((report, i) => (
                <div
                  key={report.id}
                  className="p-4 sm:p-6 hover:bg-muted/30 transition-colors ease-out animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-lg">{report.title}</h4>
                        <Badge variant="outline" className="text-xs bg-background">
                          {report.category}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs font-medium',
                            report.status === 'Corrigido' &&
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                            report.status === 'Em Análise' &&
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                            report.status === 'Reportado' &&
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                          )}
                        >
                          {report.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mt-2">
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <span>
                            <strong className="text-foreground font-medium">
                              Comportamento Reportado:
                            </strong>{' '}
                            {report.actual_behavior}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>
                            <strong className="text-foreground font-medium">
                              Comportamento Esperado:
                            </strong>{' '}
                            {report.expected_behavior}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right text-sm text-muted-foreground whitespace-nowrap bg-muted/20 p-3 rounded-lg sm:bg-transparent sm:p-0">
                      <p className="font-medium text-foreground mb-1">
                        Gravidade {report.severity}
                      </p>
                      <p>Criado em {new Date(report.created).toLocaleDateString('pt-BR')}</p>
                      <p className="mt-0.5">Por {report.expand?.user_id?.name || 'Desconhecido'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
