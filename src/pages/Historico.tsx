import { useEffect, useState } from 'react'
import { getReports } from '@/services/reports'
import { useRealtime } from '@/hooks/use-realtime'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Link } from 'react-router-dom'
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
} from 'lucide-react'
import type { ReportRecord } from '@/lib/types'
import pb from '@/lib/pocketbase/client'

export default function HistoricoPage() {
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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
  }, [])

  useRealtime('reports', () => {
    loadReports()
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Corrigido':
      case 'Ignorado':
        return (
          <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20 shadow-none">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> {status}
          </Badge>
        )
      case 'Em Análise':
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 shadow-none">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> {status}
          </Badge>
        )
      case 'Reportado':
      default:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 shadow-none">
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
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {report.title || 'Registro sem título'}
                      </h3>
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

                  {/* Footer / Meta Data / Image Button */}
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

                    {images.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                        onClick={() => {
                          const url = pb.files.getURL(report as any, images[0])
                          setPreviewImage(url)
                        }}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Ver imagem
                      </Button>
                    )}
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
    </div>
  )
}
