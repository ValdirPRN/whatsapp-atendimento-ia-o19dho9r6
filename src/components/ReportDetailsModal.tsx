import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  MessageSquare,
  AlertTriangle,
  User,
  Tag,
  Image as ImageIcon,
  CheckCircle2,
  ZoomIn,
  Terminal,
  Clock,
  Loader2,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import pb from '@/lib/pocketbase/client'
import { ReportRecord } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ReportDiscussion } from '@/components/ReportDiscussion'

interface ReportDetailsModalProps {
  reportId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDetailsModal({ reportId, open, onOpenChange }: ReportDetailsModalProps) {
  const [error, setError] = useState<ReportRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (open && reportId) {
      setLoading(true)
      pb.collection('reports')
        .getOne<ReportRecord>(reportId, { expand: 'user_id' })
        .then((res) => setError(res))
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setTimeout(() => setError(null), 300) // clear after close animation
    }
  }, [reportId, open])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Problema resolvido':
      case 'Concluído':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-semibold'
      case 'Problema não corrigido':
        return 'bg-red-500/20 text-red-400 border-red-500/30 font-semibold'
      case 'Em análise':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Aguardando validação':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Reportado':
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Crítica':
      case 'Alta':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Média':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Baixa':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl bg-black/80 backdrop-blur-xl border-white/10 text-white max-h-[90vh] overflow-y-auto w-[95vw] shadow-2xl shadow-cyan-500/5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Carregando detalhes...</p>
            </div>
          ) : error ? (
            <>
              <DialogHeader className="border-b border-white/10 pb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pr-6">
                  <div>
                    <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
                      {error.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 font-mono text-xs">
                      ID: {error.id}
                    </DialogDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn('font-medium shadow-none', getStatusColor(error.status))}
                    >
                      {error.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn('font-medium shadow-none', getSeverityColor(error.severity))}
                    >
                      {error.severity}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 transition-colors hover:bg-white/10">
                    <h4 className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Tag className="h-3.5 w-3.5" /> Categoria
                    </h4>
                    <p className="text-slate-200 text-sm">{error.category}</p>
                  </div>
                  {error.context && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 transition-colors hover:bg-white/10">
                      <h4 className="text-xs font-medium mb-1 text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <MessageSquare className="h-3.5 w-3.5" /> Contexto
                      </h4>
                      <p className="text-slate-200 text-sm line-clamp-3" title={error.context}>
                        {error.context}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 shadow-inner">
                    <h4 className="text-xs font-medium mb-2 text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertTriangle className="h-3.5 w-3.5" /> Comportamento Real
                    </h4>
                    <div className="text-red-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {error.actual_behavior}
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 shadow-inner">
                    <h4 className="text-xs font-medium mb-2 text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Comportamento Esperado
                    </h4>
                    <div className="text-emerald-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {error.expected_behavior}
                    </div>
                  </div>
                </div>

                {error.technical_notes && (
                  <div className="bg-black/60 border border-white/10 rounded-lg p-4 shadow-inner">
                    <h4 className="text-xs font-medium mb-2 text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Terminal className="h-3.5 w-3.5" /> Notas Técnicas
                    </h4>
                    <div className="text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
                      {error.technical_notes}
                    </div>
                  </div>
                )}

                {error.images && error.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4" /> Evidências
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                      {error.images.map((imgName, idx) => {
                        const imgUrl = pb.files.getURL(error as any, imgName)
                        return (
                          <div
                            key={idx}
                            className="relative group cursor-pointer shrink-0 w-48 h-32 rounded-lg overflow-hidden border border-white/10 bg-black/50 snap-center"
                            onClick={() => setPreviewImage(imgUrl)}
                          >
                            <img
                              src={imgUrl}
                              alt={`Evidência ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ZoomIn className="text-white h-8 w-8" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <ReportDiscussion reportId={error.id} />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-2 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                    <User className="h-3.5 w-3.5" />
                    {error.expand?.user_id?.name || 'Sistema'}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                    <Clock className="h-3.5 w-3.5" />
                    {format(new Date(error.created), 'dd MMM yyyy, HH:mm', { locale: ptBR })}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <AlertTriangle className="h-12 w-12 mb-4 opacity-50" />
              <p>Erro não encontrado.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-5xl p-0 bg-transparent border-none h-[95vh] flex items-center justify-center z-[100] shadow-none">
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={() => setPreviewImage(null)}
            >
              <img
                src={previewImage}
                alt="Zoom"
                className="max-w-full max-h-full object-contain cursor-zoom-out"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewImage(null)
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
