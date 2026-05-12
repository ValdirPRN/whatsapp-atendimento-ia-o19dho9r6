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
import { Plus, MessageSquare, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Erros</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo(a), {user?.name || 'Atendente'}. Registre e acompanhe os problemas da IA.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-md hover:shadow-lg transition-all ease-out">
              <Plus className="w-4 h-4" /> Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Novo Erro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título Resumido</Label>
                <Input
                  id="title"
                  placeholder="Ex: IA enviou mensagem de agendamento errada"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gravidade</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(v) => setFormData({ ...formData, severity: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                <Label htmlFor="actual">Comportamento Atual (O que a IA fez?)</Label>
                <Textarea
                  id="actual"
                  rows={3}
                  placeholder="A IA respondeu que..."
                  value={formData.actual_behavior}
                  onChange={(e) => setFormData({ ...formData, actual_behavior: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected">Comportamento Esperado (O que deveria ter feito?)</Label>
                <Textarea
                  id="expected"
                  rows={3}
                  placeholder="A IA deveria ter aguardado..."
                  value={formData.expected_behavior}
                  onChange={(e) => setFormData({ ...formData, expected_behavior: e.target.value })}
                  required
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Registrar Erro'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md ease-out">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Ativos</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md ease-out">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Em Análise</p>
              <h3 className="text-2xl font-bold">{stats.analise}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md ease-out">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Alta/Crítica</p>
              <h3 className="text-2xl font-bold">{stats.alta}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Erros Recentes em Aberto</CardTitle>
          <CardDescription>
            Acompanhe os problemas da IA reportados que ainda não foram corrigidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground animate-pulse">
              Carregando relatórios...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 ease-out">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum erro ativo no momento.</p>
              <p className="text-sm mt-1">
                Tudo está funcionando perfeitamente, excelente trabalho!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report, i) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow ease-out flex flex-col sm:flex-row gap-4 sm:items-start animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-lg">{report.title}</h4>
                      <Badge variant="outline" className="bg-background">
                        {report.category}
                      </Badge>
                      <Badge
                        variant={
                          report.severity === 'Alta' || report.severity === 'Crítica'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        Gravidade {report.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                        <span className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-1 mb-1">
                          <AlertCircle className="w-3.5 h-3.5" /> A IA Fez:
                        </span>
                        <span className="text-muted-foreground">{report.actual_behavior}</span>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                        <span className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Deveria Fazer:
                        </span>
                        <span className="text-muted-foreground">{report.expected_behavior}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reportado por{' '}
                      <strong>{report.expand?.user_id?.name || 'Desconhecido'}</strong> em{' '}
                      {new Date(report.created).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 min-w-[140px] border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                    <Select
                      value={report.status}
                      onValueChange={(v: any) => handleStatusChange(report.id, v)}
                    >
                      <SelectTrigger
                        className={cn(
                          'h-9 font-medium shadow-sm transition-colors ease-out w-full',
                          report.status === 'Reportado'
                            ? 'bg-amber-100/50 text-amber-800 border-amber-200 dark:text-amber-300 dark:bg-amber-950/50'
                            : report.status === 'Em Análise'
                              ? 'bg-blue-100/50 text-blue-800 border-blue-200 dark:text-blue-300 dark:bg-blue-950/50'
                              : 'bg-green-100/50 text-green-800 border-green-200 dark:text-green-300 dark:bg-green-950/50',
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
