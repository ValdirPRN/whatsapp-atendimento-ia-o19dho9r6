import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateReport } from '@/services/reports'
import pb from '@/lib/pocketbase/client'
import { toast } from 'sonner'
import type { ReportRecord } from '@/lib/types'
import { Loader2, Image as ImageIcon } from 'lucide-react'

interface ReportDevModalProps {
  report: ReportRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDevModal({ report, open, onOpenChange }: ReportDevModalProps) {
  const [status, setStatus] = useState(report?.status || 'Reportado')
  const [notes, setNotes] = useState(report?.technical_notes || '')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (report) {
      setStatus(report.status || 'Reportado')
      setNotes(report.technical_notes || '')
    }
  }, [report])

  const handleSave = async () => {
    if (!report) return

    if (report.status !== 'Reportado' && status === 'Reportado') {
      toast.error('Não é possível retornar ao status Reportado.')
      return
    }

    setLoading(true)
    try {
      await updateReport(report.id, { status, technical_notes: notes })
      toast.success('Análise técnica atualizada!')
      onOpenChange(false)
    } catch (e) {
      toast.error('Erro ao salvar as alterações.')
    } finally {
      setLoading(false)
    }
  }

  if (!report) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl bg-black/90 backdrop-blur-xl border-white/10 text-slate-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-white/10 pb-4 mb-4">
            <DialogTitle className="text-xl text-white">
              Análise Técnica: {report.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-3 mb-4">
            <Badge variant="outline" className="border-white/20 text-slate-300">
              {report.category}
            </Badge>
            <Badge variant="outline" className="border-red-500/30 text-red-300">
              {report.severity}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-slate-400">Comportamento Real (O que fez)</Label>
              <div className="p-3 bg-red-950/20 text-red-200 rounded-md text-sm border border-red-900/30 leading-relaxed min-h-[80px]">
                {report.actual_behavior}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Comportamento Esperado (O que deveria)</Label>
              <div className="p-3 bg-emerald-950/20 text-emerald-200 rounded-md text-sm border border-emerald-900/30 leading-relaxed min-h-[80px]">
                {report.expected_behavior}
              </div>
            </div>
          </div>

          {report.context && (
            <div className="space-y-2 mb-4">
              <Label className="text-slate-400">Contexto / Descrição</Label>
              <div className="p-3 bg-white/5 text-slate-300 rounded-md text-sm border border-white/5 whitespace-pre-wrap">
                {report.context}
              </div>
            </div>
          )}

          {report.images && report.images.length > 0 && (
            <div className="my-4">
              <Label className="text-slate-400 mb-2 block">Evidências</Label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {report.images.map((img, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="bg-black/50 border-white/10 text-white hover:bg-white/10"
                    onClick={() => setPreview(pb.files.getURL(report as any, img))}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" /> Ver Imagem {i + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 my-6 border-t border-white/10 pt-6">
            <div className="space-y-2">
              <Label className="text-white">Status da Resolução</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white focus:ring-cyan-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-800 text-white">
                  <SelectItem value="Reportado" disabled={report.status !== 'Reportado'}>
                    Reportado
                  </SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                  <SelectItem value="Problema resolvido">Problema resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Notas Técnicas (Dev)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-black/50 border-white/10 min-h-[120px] font-mono text-sm text-slate-300 focus-visible:ring-cyan-500"
                placeholder="Descreva a causa do erro, PRs relacionados, ajustes realizados..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="hover:bg-white/5 text-slate-300 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {preview && (
        <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-5xl h-[95vh] bg-transparent border-none shadow-none flex items-center justify-center p-0">
            <DialogTitle className="sr-only">Visualização de Imagem</DialogTitle>
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={() => setPreview(null)}
            >
              <img
                src={preview}
                className="max-w-full max-h-full object-contain cursor-zoom-out rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
