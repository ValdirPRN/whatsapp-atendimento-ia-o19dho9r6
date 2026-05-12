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
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
      case 'Alta':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
      case 'Média':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Corrigido':
        return (
          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
            Corrigido
          </Badge>
        )
      case 'Em Análise':
        return (
          <Badge
            variant="secondary"
            className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-transparent dark:bg-indigo-900/40 dark:text-indigo-300"
          >
            Em Análise
          </Badge>
        )
      case 'Reportado':
        return (
          <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
            Reportado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Histórico de Erros</h2>
          <p className="text-muted-foreground text-sm">
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

      <Card className="flex-1 shadow-sm border-white/10 bg-black/40 backdrop-blur-md filter-glass flex flex-col overflow-hidden">
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader className="bg-black/60 sticky top-0 z-10 border-b border-white/10 backdrop-blur-sm">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Problema & Contexto</TableHead>
                <TableHead className="hidden xl:table-cell">Comportamento Real</TableHead>
                <TableHead className="hidden xl:table-cell">Comportamento Esperado</TableHead>
                <TableHead className="hidden lg:table-cell">Categoria</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    Carregando registros...
                  </TableCell>
                </TableRow>
              ) : filteredErrors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredErrors.map((error: ReportRecord) => (
                  <TableRow key={error.id} className="group hover:bg-muted/20 transition-colors">
                    <TableCell className="font-mono text-xs font-medium text-primary align-top pt-4">
                      <Link to={`/erro/${error.id}`}>{error.id}</Link>
                    </TableCell>
                    <TableCell className="max-w-[250px] sm:max-w-[300px]">
                      <div className="flex items-start gap-3">
                        {error.images && error.images.length > 0 ? (
                          <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted border border-border flex items-center justify-center">
                            <img
                              src={pb.files.getURL(error as any, error.images[0], {
                                thumb: '100x100',
                              })}
                              alt="Thumbnail"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 shrink-0 rounded-md bg-muted border border-border flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="flex flex-col space-y-1 overflow-hidden">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              to={`/erro/${error.id}`}
                              className="font-medium group-hover:text-primary transition-colors truncate block max-w-full"
                            >
                              {error.title || 'Sem título'}
                            </Link>
                            {isNew(error.created) && (
                              <Badge className="h-4 text-[9px] px-1 bg-blue-500 hover:bg-blue-600 border-none shrink-0">
                                NOVO
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {error.context || error.actual_behavior}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell align-top pt-4 max-w-[200px]">
                      <span className="text-xs text-muted-foreground line-clamp-3">
                        {error.actual_behavior}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell align-top pt-4 max-w-[200px]">
                      <span className="text-xs text-muted-foreground line-clamp-3">
                        {error.expected_behavior}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell align-top pt-4">
                      <span className="text-sm">{error.category}</span>
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
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm align-top pt-4">
                      {new Date(error.created).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
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
