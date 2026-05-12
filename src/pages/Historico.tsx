import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertCircle, CheckCircle2, Clock, MessageSquareWarning, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Report {
  id: string
  title: string
  context: string
  actual_behavior: string
  expected_behavior: string
  category: string
  severity: string
  status: string
  created: string
  user_id?: string
  expand?: {
    user_id?: {
      name: string
      email: string
    }
  }
}

function NovoRelatoDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    context: '',
    actual_behavior: '',
    expected_behavior: '',
    category: '',
    severity: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await pb.collection('reports').create({
        ...formData,
        status: 'Reportado',
        user_id: user?.id,
      })
      toast.success('Relato registrado com sucesso!')
      setOpen(false)
      setFormData({
        title: '',
        context: '',
        actual_behavior: '',
        expected_behavior: '',
        category: '',
        severity: '',
      })
      onCreated()
    } catch (error) {
      toast.error('Erro ao registrar relato.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Novo Relato
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Novo Erro</DialogTitle>
          <DialogDescription>
            Descreva detalhadamente o erro ou comportamento inesperado da IA.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Erro</Label>
            <Input
              id="title"
              placeholder="Ex: Mensagem sem contexto..."
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                required
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Triagem da conversa">Triagem da conversa</SelectItem>
                  <SelectItem value="Filtro de etiquetas do WhatsApp">
                    Filtro de etiquetas
                  </SelectItem>
                  <SelectItem value="Geração de respostas">Geração de respostas</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gravidade</Label>
              <Select
                required
                value={formData.severity}
                onValueChange={(v) => setFormData({ ...formData, severity: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Contexto (Opcional)</Label>
            <textarea
              id="context"
              placeholder="O que o paciente disse ou qual era o fluxo?"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actual">Comportamento Atual (O que a IA fez?)</Label>
            <textarea
              id="actual"
              required
              placeholder="A IA inventou uma resposta..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              value={formData.actual_behavior}
              onChange={(e) => setFormData({ ...formData, actual_behavior: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected">Comportamento Esperado (O que deveria fazer?)</Label>
            <textarea
              id="expected"
              required
              placeholder="A IA deveria pedir mais contexto..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              value={formData.expected_behavior}
              onChange={(e) => setFormData({ ...formData, expected_behavior: e.target.value })}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Relato'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function Historico() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const loadReports = async () => {
    try {
      const records = await pb.collection('reports').getFullList<Report>({
        sort: '-created',
        expand: 'user_id',
      })
      setReports(records)
    } catch (error) {
      console.error('Error loading reports:', error)
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

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'alta':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'média':
      case 'media':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'baixa':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolvido':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'em análise':
      case 'em analise':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <MessageSquareWarning className="w-8 h-8 text-primary" />
            Histórico de Relatos
          </h1>
          <p className="text-muted-foreground">
            Acompanhe todos os erros e comportamentos inesperados reportados pela equipe.
          </p>
        </div>
        <NovoRelatoDialog onCreated={loadReports} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <CheckCircle2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <CardTitle className="text-xl text-muted-foreground">Nenhum relato encontrado</CardTitle>
          <CardDescription>Quando a equipe registrar erros, eles aparecerão aqui.</CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="flex flex-col hover:shadow-md transition-shadow duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${getSeverityColor(report.severity)}`}
                  >
                    {report.severity || 'Sem gravidade'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                    {getStatusIcon(report.status)}
                    <span className="capitalize">{report.status || 'Reportado'}</span>
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {report.title}
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2 text-xs">
                  <span>
                    {format(new Date(report.created), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                  {report.expand?.user_id && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[120px]" title={report.expand.user_id.name}>
                        {report.expand.user_id.name}
                      </span>
                    </>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {report.context && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                      Contexto
                    </span>
                    <p className="text-sm text-foreground/90 bg-muted/40 p-2.5 rounded-md border border-border/50 line-clamp-3">
                      {report.context}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-red-500/80 tracking-wider flex items-center gap-1">
                      Comportamento Atual
                    </span>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {report.actual_behavior}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-green-500/80 tracking-wider flex items-center gap-1">
                      Comportamento Esperado
                    </span>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {report.expected_behavior}
                    </p>
                  </div>
                </div>
              </CardContent>

              {report.category && (
                <CardFooter className="pt-4 border-t bg-muted/10 flex justify-between items-center">
                  <span
                    className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md truncate max-w-[200px]"
                    title={report.category}
                  >
                    {report.category}
                  </span>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
