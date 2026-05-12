import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  AlertTriangle,
  User,
  Tag,
  Image as ImageIcon,
  CheckCircle2,
  ChevronRight,
  ZoomIn,
} from 'lucide-react'

import { mockErrors } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export default function ErroDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()

  const error = mockErrors.find((e) => e.id === id)

  if (!error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Erro não encontrado</h2>
        <Button onClick={() => navigate('/historico')}>Voltar ao Histórico</Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Corrigido':
        return 'bg-emerald-500 text-white border-emerald-500'
      case 'Em Análise':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in-up pb-10">
      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">{error.title}</h2>
            <Badge variant="outline" className={getStatusColor(error.status)}>
              {error.status}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono text-sm mt-1">{error.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Context */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Descrição do Caso
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 text-foreground leading-relaxed">
                {error.context}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Tag className="h-3 w-3" /> Categoria
                  </p>
                  <p className="font-medium text-sm">{error.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Severidade
                  </p>
                  <p className="font-medium text-sm text-amber-600 dark:text-amber-400">
                    {error.severity}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3 w-3" /> Reportado por
                  </p>
                  <p className="font-medium text-sm">{error.agent}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Data
                  </p>
                  <p className="font-medium text-sm">
                    {format(new Date(error.date), 'dd MMM yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" /> Evidências
              </CardTitle>
              <CardDescription>Capturas de tela anexadas ao relatório</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {error.images && error.images.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                  {error.images.map((img, idx) => (
                    <Dialog key={idx}>
                      <DialogTrigger asChild>
                        <div className="relative group cursor-pointer shrink-0 w-48 h-80 rounded-xl overflow-hidden border border-border shadow-sm snap-center">
                          <img
                            src={img}
                            alt={`Evidência ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <ZoomIn className="text-white h-8 w-8" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw] md:max-w-4xl p-1 bg-black/95 border-none h-[90vh] flex items-center justify-center">
                        <img
                          src={img}
                          alt="Zoom"
                          className="max-w-full max-h-full object-contain"
                        />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                  Nenhuma imagem anexada.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border/50 sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {error.timeline.map((event, index) => (
                  <div
                    key={event.id}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    {/* Marker */}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                      {index === error.timeline.length - 1 && event.action.includes('Corrigido') ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-even:pl-4 md:group-odd:pr-4">
                      <div className="flex flex-col p-3 bg-background border border-border shadow-sm rounded-lg">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-sm">{event.action}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>{event.user}</span>
                          <span className="tabular-nums">
                            {format(new Date(event.date), 'HH:mm')}
                          </span>
                        </div>
                        {event.notes && (
                          <div className="mt-2 text-sm text-foreground/80 bg-muted/40 p-2 rounded-md italic border-l-2 border-primary">
                            "{event.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <Button className="w-full justify-between" variant="outline">
                  Atualizar Status <ChevronRight className="h-4 w-4" />
                </Button>
                <Button className="w-full justify-between" variant="outline">
                  Adicionar Nota <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
