import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Filter, MoreHorizontal, FileText, Image as ImageIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { ReportRecord } from '@/lib/types'

export default function Historico() {
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('Todos')

  const fetchReports = async () => {
    try {
      const records = await pb.collection('reports').getFullList<ReportRecord>({
        sort: '-created',
        expand: 'user_id',
      })
      setReports(records)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  useRealtime('reports', () => {
    fetchReports()
  })

  const filteredErrors = reports.filter((error) =>
    filterStatus === 'Todos' ? true : error.status === filterStatus,
  )

  const isNew = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime()
    return diff < 24 * 60 * 60 * 1000
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Crítica':
        return 'bg-red-500 text-white hover:bg-red-600'
      case 'Alta':
        return 'bg-orange-500 text-white hover:bg-orange-600'
      case 'Média':
        return 'bg-blue-500 text-white hover:bg-blue-600'
      case 'Baixa':
      default:
        return 'bg-slate-500 text-white hover:bg-slate-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Corrigido':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent">
            Corrigido
          </Badge>
        )
      case 'Em Análise':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-transparent">
            Em Análise
          </Badge>
        )
      case 'Reportado':
        return (
          <Badge className="bg-slate-500 hover:bg-slate-600 text-white border-transparent">
            Reportado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <div className="space-y-6 animate-fade-in-up h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Histórico de Erros</h2>
          <p className="text-slate-300 text-sm">
            Gerencie e acompanhe todos os registros de anomalias do AgentPro em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Últimos 30 dias</span>
          </Button>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] flex-1 sm:flex-none">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrar por Status" />
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

      <Card className="flex-1 shadow-2xl border-white/10 bg-black/60 backdrop-blur-2xl flex flex-col overflow-hidden">
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader className="bg-black/80 sticky top-0 z-10 border-b border-white/10 backdrop-blur-md">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-slate-300">Problema & Contexto</TableHead>
                <TableHead className="hidden xl:table-cell text-slate-300">
                  Comportamento Real
                </TableHead>
                <TableHead className="hidden xl:table-cell text-slate-300">
                  Comportamento Esperado
                </TableHead>
                <TableHead className="hidden lg:table-cell text-slate-300">Categoria</TableHead>
                <TableHead className="text-slate-300">Prioridade</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="hidden md:table-cell text-slate-300">Data</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-400">
                    Carregando registros...
                  </TableCell>
                </TableRow>
              ) : filteredErrors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-400">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredErrors.map((error: ReportRecord) => (
                  <TableRow key={error.id} className="group hover:bg-muted/20 transition-colors">
                    <TableCell className="max-w-[250px] sm:max-w-[300px] align-top pt-4">
                      <div className="flex items-start gap-3">
                        {error.images && error.images.length > 0 ? (
                          <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center">
                            <img
                              src={pb.files.getURL(error as any, error.images[0], {
                                thumb: '100x100',
                              })}
                              alt="Thumbnail"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 shrink-0 rounded-md bg-black/50 border border-white/10 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-slate-500" />
                          </div>
                        )}
                        <div className="flex flex-col space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              to={`/erro/${error.id}`}
                              className="font-medium text-slate-100 group-hover:text-white transition-colors truncate block max-w-full"
                            >
                              {error.title || 'Sem título'}
                            </Link>
                            {isNew(error.created) && (
                              <Badge className="h-4 text-[9px] px-1 bg-blue-500 hover:bg-blue-600 text-white border-none shrink-0">
                                NOVO
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 line-clamp-2">
                            {error.context || error.actual_behavior}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell align-top pt-4 max-w-[200px]">
                      <span className="text-xs text-slate-300 line-clamp-3">
                        {error.actual_behavior}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell align-top pt-4 max-w-[200px]">
                      <span className="text-xs text-slate-300 line-clamp-3">
                        {error.expected_behavior}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell align-top pt-4">
                      <span className="text-sm text-slate-200">{error.category}</span>
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      <Badge
                        variant="secondary"
                        className={`${getSeverityColor(error.severity)} border-transparent hover:bg-opacity-80`}
                      >
                        {error.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top pt-4">{getStatusBadge(error.status)}</TableCell>
                    <TableCell className="hidden md:table-cell text-slate-400 text-sm align-top pt-4 whitespace-nowrap">
                      {formatDate(error.created)}
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-white/10"
                          >
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/erro/${error.id}`} className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
