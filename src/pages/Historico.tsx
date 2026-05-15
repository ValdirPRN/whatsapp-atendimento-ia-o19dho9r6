import { useEffect, useState } from 'react'
import { getReports, updateReport, deleteReport } from '@/services/reports'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Inbox,
  ShieldAlert,
  User,
  Image as ImageIcon,
  MessageSquare,
  AlertTriangle,
  Terminal,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  MessageSquareWarning,
} from 'lucide-react'
import type { ReportRecord } from '@/lib/types'
import pb from '@/lib/pocketbase/client'
import { ReportDetailsModal } from '@/components/ReportDetailsModal'

export default function HistoricoPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [devMessagesMap, setDevMessagesMap] = useState<Record<string, boolean>>({})

  const loadDevMessages = async () => {
    try {
      const messages = await pb.collection('report_messages').getFullList({
        expand: 'user_id',
        fields: 'report_id,expand.user_id.role',
      })
      const map: Record<string, boolean> = {}
      messages.forEach((msg: any) => {
        if (msg.expand?.user_id?.role === 'dev' || msg.expand?.user_id?.role === 'admin') {
          map[msg.report_id] = true
        }
      })
      setDevMessagesMap(map)
    } catch (error) {
      console.error('Failed to load dev messages', error)
    }
  }

  const loadReports = async () => {
    try {
      const data = await getReports('', '-created')
      setReports(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
    loadDevMessages()
  }, [])

  useRealtime('reports', () => {
    loadReports()
  })

  useRealtime('report_messages', () => {
    loadDevMessages()
  })

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id)
      await updateReport(id, { status: newStatus })
      toast.success('Status atualizado com sucesso!')
    } catch (error) {
      console.error('Failed to update status', error)
      toast.error('Erro ao atualizar o status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setUpdatingId(id)
      await deleteReport(id)
      setDeleteId(null)
      toast.success('Relato excluído com sucesso!')
    } catch (error) {
      console.error('Failed to delete report', error)
      toast.error('Erro ao excluir o relato.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Problema resolvido':
      case 'Concluído':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 shadow-none font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {status}
          </Badge>
        )
      case 'Problema não corrigido':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 shadow-none font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> {status}
          </Badge>
        )
      case 'Em análise':
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 shadow-none">
            <Clock className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> {status}
          </Badge>
        )
      case 'Aguardando validação':
        return (
          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20 shadow-none">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> {status}
          </Badge>
        )
      case 'Reportado':
      default:
        return (
          <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20 shadow-none">
            <Clock className="w-3.5 h-3.5 mr-1.5" /> {status || 'Reportado'}
          </Badge>
        )
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Crítica':
      case 'Alta':
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-400 border-red-500/30 shadow-none"
          >
            {severity}
          </Badge>
        )
      case 'Média':
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-none"
          >
            {severity}
          </Badge>
        )
      case 'Baixa':
      default:
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-none"
          >
            {severity || 'Baixa'}
          </Badge>
        )
    }
  }

  const getImages = (report: ReportRecord) => {
    if (!report.images) return []
    return Array.isArray(report.images) ? report.images : [report.images]
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Histórico de Erros</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-cyan-400 flex flex-col items-center gap-2">
            <Clock className="w-8 h-8 animate-spin" />
            <span>Carregando histórico...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Histórico de Erros</h1>
          <p className="text-slate-400">
            Visão estratégica e monitoramento de comportamentos da IA.
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Inbox className="w-16 h-16 mb-6 opacity-50 text-cyan-500" />
            <p className="text-xl font-medium text-white mb-2">Nenhum erro reportado ainda</p>
            <p className="text-slate-400 text-center max-w-md mb-8">
              Seu histórico está vazio. Quando a equipe relatar discrepâncias na IA, elas aparecerão
              aqui para análise.
            </p>
            <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Link to="/novo-registro">
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Relato
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => {
            const images = getImages(report)
            return (
              <Card
                key={report.id}
                className="bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/20"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between md:items-start mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white leading-tight">
                          {report.title || 'Registro sem título'}
                        </h3>
                        {user?.role !== 'dev' && devMessagesMap[report.id] && (
                          <button
                            onClick={() => setSelectedReportId(report.id)}
                            className="flex items-center justify-center text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 p-1.5 rounded-full transition-colors animate-pulse border border-amber-400/20 shrink-0"
                            title="Nova interação técnica disponível"
                          >
                            <MessageSquareWarning className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-cyan-400 bg-cyan-500/10 w-fit px-2.5 py-1 rounded-md border border-cyan-500/20">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span className="font-medium text-slate-200">
                          {report.category || 'Não categorizada'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {getStatusBadge(report.status)}
                      {getSeverityBadge(report.severity)}
                    </div>
                  </div>

                  {/* Behaviors - Juxtaposed */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                      <h4 className="text-xs font-semibold mb-2 text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <AlertTriangle className="h-3.5 w-3.5" /> Comportamento Real (O que fez)
                      </h4>
                      <div className="text-red-100/90 text-sm leading-relaxed whitespace-pre-wrap">
                        {report.actual_behavior}
                      </div>
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                      <h4 className="text-xs font-semibold mb-2 text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Comportamento Esperado (O que
                        deveria)
                      </h4>
                      <div className="text-emerald-100/90 text-sm leading-relaxed whitespace-pre-wrap">
                        {report.expected_behavior}
                      </div>
                    </div>
                  </div>

                  {/* Optional Context & Technical Notes */}
                  {(report.context || report.technical_notes) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {report.context && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <h4 className="text-xs font-medium mb-2 text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <MessageSquare className="h-3.5 w-3.5" /> Contexto / Descrição
                          </h4>
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {report.context}
                          </p>
                        </div>
                      )}
                      {report.technical_notes && (
                        <div className="bg-black/40 border border-white/5 rounded-lg p-4">
                          <h4 className="text-xs font-medium mb-2 text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                            <Terminal className="h-3.5 w-3.5" /> Notas Técnicas
                          </h4>
                          <div className="text-slate-400 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
                            {report.technical_notes}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer / Meta Data & Action Bar */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-300">
                          {report.expand?.user_id?.name ||
                            report.expand?.user_id?.email ||
                            'Sistema'}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {format(new Date(report.created), 'dd MMM yyyy, HH:mm', { locale: ptBR })}
                      </span>
                      <span className="text-slate-500 font-mono">ID: {report.id}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {images.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors h-8"
                          onClick={() => {
                            const url = pb.files.getURL(report as any, images[0])
                            setPreviewImage(url)
                          }}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Ver imagem
                        </Button>
                      )}

                      <div className="relative">
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          disabled={updatingId === report.id}
                          className="appearance-none bg-black/40 border border-white/10 text-slate-200 text-xs font-medium rounded-md pl-3 pr-8 py-1.5 h-8 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 cursor-pointer w-full sm:w-auto"
                        >
                          <option value="Reportado">Reportado</option>
                          <option value="Em análise">Em análise</option>
                          <option value="Aguardando validação">Aguardando validação</option>
                          <option value="Problema resolvido">Problema resolvido</option>
                          <option value="Problema não corrigido">Problema não corrigido</option>
                          <option value="Concluído">Concluído</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                          {updatingId === report.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 hover:text-red-300 transition-colors h-8 w-8 p-0"
                        onClick={() => setDeleteId(report.id)}
                        title="Excluir relato"
                        disabled={updatingId === report.id}
                      >
                        {updatingId === report.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-5xl p-0 bg-transparent border-none h-[95vh] flex items-center justify-center shadow-none">
            <DialogTitle className="sr-only">Visualização de Imagem</DialogTitle>
            <div
              className="relative w-full h-full flex items-center justify-center group"
              onClick={() => setPreviewImage(null)}
            >
              <img
                src={previewImage}
                alt="Evidência"
                className="max-w-full max-h-[90vh] object-contain cursor-zoom-out rounded-lg shadow-2xl ring-1 ring-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewImage(null)
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Report Details Modal */}
      <ReportDetailsModal
        reportId={selectedReportId}
        open={!!selectedReportId}
        onOpenChange={(open) => !open && setSelectedReportId(null)}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="bg-black/90 border-white/10 text-white shadow-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-slate-400">
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-white/10 text-white hover:bg-white/10"
              disabled={!!updatingId}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
              disabled={!!updatingId}
            >
              {updatingId === deleteId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
