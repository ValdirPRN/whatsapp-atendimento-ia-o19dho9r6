import { useEffect, useState } from 'react'
import { getReports, type Report } from '@/services/reports'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock, Inbox, ShieldAlert } from 'lucide-react'

export default function HistoricoPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const loadReports = async () => {
    if (!user) return
    try {
      const data = await getReports(`user_id = "${user.id}"`)
      setReports(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [user?.id])

  useRealtime('reports', () => {
    loadReports()
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Corrigido':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Corrigido
          </Badge>
        )
      case 'Em Análise':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
            <AlertCircle className="w-3 h-3 mr-1" /> Em Análise
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">
            <Clock className="w-3 h-3 mr-1" /> {status || 'Reportado'}
          </Badge>
        )
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Crítica':
        return (
          <Badge variant="outline" className="text-red-400 border-red-500/30">
            Crítica
          </Badge>
        )
      case 'Alta':
        return (
          <Badge variant="outline" className="text-orange-400 border-orange-500/30">
            Alta
          </Badge>
        )
      case 'Média':
        return (
          <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
            Média
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-green-400 border-green-500/30">
            Baixa
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 max-w-5xl mx-auto w-full">
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
    <div className="flex flex-col space-y-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Histórico de Erros</h1>
          <p className="text-slate-400">Acompanhe o status dos erros que você reportou.</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Inbox className="w-12 h-12 mb-4 opacity-50 text-cyan-500" />
            <p className="text-lg font-medium text-white">Nenhum erro relatado ainda</p>
            <p className="text-sm mt-1">
              Seus registros aparecerão aqui quando você criar um novo report.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden hover:bg-white/[0.02] transition-all duration-300 hover:border-white/20"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-4">
                  <div className="space-y-1">
                    <h3
                      className="text-lg font-semibold text-white line-clamp-1"
                      title={report.title || 'Sem título'}
                    >
                      {report.title || 'Registro sem título'}
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(report.created), "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(report.status)}
                    {getSeverityBadge(report.severity)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium text-white">Categoria:</span>
                  <span>{report.category || 'Não categorizado'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
