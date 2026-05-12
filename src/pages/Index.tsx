import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  PlusCircle,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { ReportRecord } from '@/lib/types'

export default function Index() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolutionRate: 0,
    commonCategory: 'N/A',
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [recentReports, setRecentReports] = useState<ReportRecord[]>([])

  const loadData = useCallback(async () => {
    try {
      const records = await pb.collection('reports').getFullList<ReportRecord>({ sort: '-created' })
      setRecentReports(records.slice(0, 5))

      const pending = records.filter(
        (r) => r.status === 'Em Análise' || r.status === 'Reportado',
      ).length
      const resolved = records.filter((r) => r.status === 'Corrigido').length

      const categories: Record<string, number> = {}
      records.forEach((r) => {
        categories[r.category] = (categories[r.category] || 0) + 1
      })
      const common = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]

      setStats({
        total: records.length,
        pending,
        resolutionRate: records.length ? Math.round((resolved / records.length) * 100) : 0,
        commonCategory: common ? common[0] : 'N/A',
      })

      const days = Array.from({ length: 7 })
        .map((_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - i)
          return d.toISOString().split('T')[0]
        })
        .reverse()

      const data = days.map((date) => {
        const dayRecords = records.filter((r) => r.created.startsWith(date))
        return {
          date: date.substring(5).replace('-', '/'),
          errors: dayRecords.length,
          resolved: dayRecords.filter((r) => r.status === 'Corrigido').length,
        }
      })
      setChartData(data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('reports', () => {
    loadData()
  })

  return (
    <div className="space-y-12 animate-fade-in-up pb-20">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-black/30 backdrop-blur-md filter-glass mb-8 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-sm font-medium text-cyan-100 tracking-wide whitespace-pre">
            {' PRN - MEDimagem'}
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-sans tracking-tighter mb-6 filter-text-glow drop-shadow-xl">
          <span className="font-light text-white">Agent</span>
          <span className="font-black text-gradient-cyan-orange">Pro</span>
        </h1>

        <p className="text-xl text-white/60 max-w-2xl font-light mb-12">
          sistema interno afim de relatar problemas sobre a ia de atendimento de palhoça
        </p>

        <div className="relative flex items-center w-56 h-12 group cursor-pointer">
          <div className="absolute inset-0 w-full h-full filter-gooey -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-orange-500 rounded-full" />
            <div className="absolute top-0 right-0 bg-orange-500 w-12 h-12 rounded-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-12" />
          </div>
          <Link
            to="/novo-registro"
            className="absolute inset-0 flex items-center justify-center text-black font-bold z-10 text-sm hover:scale-105 transition-transform duration-300"
          >
            Registrar Anomalia
          </Link>
          <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-12 z-10 opacity-0 group-hover:opacity-100 pointer-events-none">
            <ArrowRight className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/40 backdrop-blur-md border-white/10 filter-glass hover:bg-black/60 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total de Erros</CardTitle>
            <AlertCircle className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-white/40 mt-1">Registros gerais rastreados</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 backdrop-blur-md border-white/10 filter-glass hover:bg-black/60 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Pendentes</CardTitle>
            <HelpCircle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.pending}</div>
            <p className="text-xs text-white/40 mt-1">Aguardando intervenção</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 backdrop-blur-md border-white/10 filter-glass hover:bg-black/60 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Taxa de Resolução</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.resolutionRate}%</div>
            <p className="text-xs text-white/40 mt-1">Proporção de correções ativas</p>
          </CardContent>
        </Card>
        <Card className="bg-black/40 backdrop-blur-md border-white/10 filter-glass hover:bg-black/60 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Categoria Principal</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div
              className="text-base font-semibold mt-1 text-white truncate"
              title={stats.commonCategory}
            >
              {stats.commonCategory}
            </div>
            <p className="text-xs text-white/40 mt-1">Maior frequência registrada</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <Card className="lg:col-span-2 bg-black/40 backdrop-blur-md border-white/10 filter-glass flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Desempenho da Rede (Últimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ChartContainer
              config={{
                errors: { label: 'Erros', color: 'hsl(var(--destructive))' },
                resolved: { label: 'Resolvidos', color: 'hsl(var(--primary))' },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="errors"
                    stroke="#f97316"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorErrors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions & Info */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10 filter-glass flex flex-col justify-center items-center text-center p-8">
          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6 filter-logo-glow">
            <PlusCircle className="w-10 h-10 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">Anomalia Detectada?</h3>
          <p className="text-sm text-white/60 mb-8">
            Ajude-nos a melhorar a precisão da IA documentando o comportamento inesperado.
          </p>
          <Button
            asChild
            size="lg"
            className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-full transition-transform hover:scale-105"
          >
            <Link to="/novo-registro">Registrar Incidente</Link>
          </Button>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <Card className="bg-black/40 backdrop-blur-md border-white/10 filter-glass">
        <CardHeader>
          <CardTitle className="text-white">Últimos Registros Interceptados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="border-white/10">
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-white/60">Data</TableHead>
                <TableHead className="text-white/60">Título</TableHead>
                <TableHead className="text-white/60">Categoria</TableHead>
                <TableHead className="text-right text-white/60">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-white/50 h-24">
                    Nenhuma anomalia interceptada
                  </TableCell>
                </TableRow>
              ) : (
                recentReports.map((error) => (
                  <TableRow
                    key={error.id}
                    className="group hover:bg-white/5 border-white/10 cursor-pointer"
                  >
                    <TableCell className="text-white/60 text-sm">
                      {new Date(error.created).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium text-cyan-400">
                      <Link to={`/erro/${error.id}`} className="hover:underline">
                        {error.title || error.id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-white/80">{error.category}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          error.status === 'Corrigido'
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                            : error.status === 'Em Análise'
                              ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                              : 'border-white/20 bg-white/5 text-white/70'
                        }
                      >
                        {error.status}
                      </Badge>
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
