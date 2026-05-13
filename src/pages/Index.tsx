import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getReports, createReport, updateReport, Report } from '@/services/reports'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Plus,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  MessageSquareWarning,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'Triagem da conversa',
  'Filtro de etiquetas do WhatsApp',
  'Agendamento',
  'Outros',
]
const SEVERITIES = ['Baixa', 'Média', 'Alta', 'Crítica']

export default function IndexPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    actual_behavior: '',
    expected_behavior: '',
    severity: 'Média',
  })

  const loadReports = async () => {
    try {
      const data = await getReports('status != "Corrigido"', '-created')
      setReports(data.slice(0, 15))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    try {
      await createReport({
        ...formData,
        status: 'Reportado',
        user_id: user.id,
      } as Partial<Report>)
      toast.success('Relatório enviado com sucesso!')
      setIsOpen(false)
      setFormData({
        title: '',
        category: CATEGORIES[0],
        actual_behavior: '',
        expected_behavior: '',
        severity: 'Média',
      })
    } catch (err) {
      const errors = extractFieldErrors(err)
      toast.error(errors.title || 'Erro ao enviar relatório. Verifique os campos.')
    } finally {
      setSubmitting(false)
    }
  }

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
    alta: reports.filter((r) => r.severity === 'Alta' || r.severity === 'Crítica').length,
    analise: reports.filter((r) => r.status === 'Em Análise').length,
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
              <MessageSquareWarning className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-cyan-500 drop-shadow-md">
              Agent<span className="font-light text-cyan-400">Pro</span>
            </h1>
          </div>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl">
            Bem-vindo(a),{' '}
            <span className="text-slate-200 font-medium">{user?.name || 'Atendente'}</span>. Central
            de monitoramento inteligente e registro de ocorrências da IA.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-md hover:shadow-lg transition-all ease-out">
              <Plus className="w-4 h-4" /> Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-2xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Registrar Novo Erro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Título Resumido
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: IA enviou mensagem de agendamento errada"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-black/50 border-white/10 focus-visible:ring-cyan-500 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger className="bg-black/50 border-white/10 text-white focus:ring-cyan-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10 text-white">
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Gravidade</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(v) => setFormData({ ...formData, severity: v })}
                  >
                    <SelectTrigger className="bg-black/50 border-white/10 text-white focus:ring-cyan-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10 text-white">
                      {SEVERITIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual" className="text-slate-300">
                  Comportamento Atual (O que a IA fez?)
                </Label>
                <Textarea
                  id="actual"
                  rows={3}
                  placeholder="A IA respondeu que..."
                  value={formData.actual_behavior}
                  onChange={(e) => setFormData({ ...formData, actual_behavior: e.target.value })}
                  required
                  className="bg-black/50 border-white/10 focus-visible:ring-cyan-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected" className="text-slate-300">
                  Comportamento Esperado (O que deveria ter feito?)
                </Label>
                <Textarea
                  id="expected"
                  rows={3}
                  placeholder="A IA deveria ter aguardado..."
                  value={formData.expected_behavior}
                  onChange={(e) => setFormData({ ...formData, expected_behavior: e.target.value })}
                  required
                  className="bg-black/50 border-white/10 focus-visible:ring-cyan-500 text-white"
                />
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  {submitting ? 'Enviando...' : 'Registrar Erro'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-lg transition-all hover:shadow-xl hover:bg-black/70 ease-out">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 text-cyan-400 rounded-full flex items-center justify-center border border-blue-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Ativos</p>
              <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-lg transition-all hover:shadow-xl hover:bg-black/70 ease-out">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Em Análise</p>
              <h3 className="text-2xl font-bold text-white">{stats.analise}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/60 backdrop-blur-xl border-white/10 shadow-lg transition-all hover:shadow-xl hover:bg-black/70 ease-out">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center border border-red-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Alta/Crítica</p>
              <h3 className="text-2xl font-bold text-white">{stats.alta}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl bg-black/60 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Erros Recentes em Aberto</CardTitle>
          <CardDescription className="text-slate-400">
            Acompanhe os problemas da IA reportados que ainda não foram corrigidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400 animate-pulse">
              Carregando relatórios...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 ease-out">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4 opacity-70" />
              <p className="text-lg font-medium text-white">Nenhum erro ativo no momento.</p>
              <p className="text-sm mt-1">
                Tudo está funcionando perfeitamente, excelente trabalho!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report, i) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl border border-white/5 bg-black/40 hover:bg-black/60 hover:shadow-xl transition-all ease-out flex flex-col sm:flex-row gap-4 sm:items-start animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-lg text-white">{report.title}</h4>
                      <Badge
                        variant="outline"
                        className="bg-black/50 text-slate-300 border-white/10"
                      >
                        {report.category}
                      </Badge>
                      <Badge
                        variant={
                          report.severity === 'Alta' || report.severity === 'Crítica'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={
                          report.severity === 'Alta' || report.severity === 'Crítica'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }
                      >
                        Gravidade {report.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-red-950/20 p-3 rounded-lg border border-red-900/30">
                        <span className="font-semibold text-red-400 flex items-center gap-1 mb-1">
                          <AlertCircle className="w-3.5 h-3.5" /> A IA Fez:
                        </span>
                        <span className="text-slate-300">{report.actual_behavior}</span>
                      </div>
                      <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Deveria Fazer:
                        </span>
                        <span className="text-slate-300">{report.expected_behavior}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Reportado por{' '}
                      <strong className="text-slate-300">
                        {report.expand?.user_id?.name || 'Desconhecido'}
                      </strong>{' '}
                      em{' '}
                      <span className="text-slate-400">
                        {new Date(report.created).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 min-w-[140px] border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                    <Select
                      value={report.status}
                      onValueChange={(v: any) => handleStatusChange(report.id, v)}
                    >
                      <SelectTrigger
                        className={cn(
                          'h-9 font-medium shadow-sm transition-colors ease-out w-full border text-white',
                          report.status === 'Reportado'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-950/60'
                            : report.status === 'Em Análise'
                              ? 'bg-blue-950/40 text-blue-300 border-blue-500/30 hover:bg-blue-950/60'
                              : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/60',
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Reportado">Reportado</SelectItem>
                        <SelectItem value="Em Análise">Em Análise</SelectItem>
                        <SelectItem value="Corrigido">Corrigido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
