import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, TrendingUp, HelpCircle, Plus } from 'lucide-react'
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
import { mockErrors, mockChartData } from '@/lib/mock-data'

export default function Index() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Erros
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground mt-1">+12% em relação à semana passada</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes de Análise
            </CardTitle>
            <HelpCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground mt-1">Requerem atenção da engenharia</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Resolução
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Média dos últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categoria Mais Comum
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-semibold mt-1">Alucinação de Produto</div>
            <p className="text-xs text-muted-foreground mt-1">Representa 42% dos registros</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <Card className="lg:col-span-2 shadow-sm border-border/50 flex flex-col">
          <CardHeader>
            <CardTitle>Desempenho da IA (Últimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ChartContainer
              config={{
                errors: { label: 'Erros Reportados', color: 'hsl(var(--destructive))' },
                resolved: { label: 'Problemas Resolvidos', color: 'hsl(var(--primary))' },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="errors"
                    stroke="hsl(var(--destructive))"
                    fillOpacity={1}
                    fill="url(#colorErrors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions & Info */}
        <Card className="shadow-sm border-border/50 flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <PlusCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Registrou uma anomalia?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Ajude-nos a melhorar a precisão do nosso assistente virtual registrando falhas e
            comportamentos inesperados.
          </p>
          <Button asChild size="lg" className="w-full shadow-md hover:shadow-lg transition-all">
            <Link to="/novo-registro">
              <Plus className="mr-2 h-4 w-4" /> Registrar Novo Erro
            </Link>
          </Button>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle>Últimos Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockErrors.slice(0, 5).map((error) => (
                <TableRow key={error.id} className="group cursor-pointer">
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(error.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    <Link to={`/erro/${error.id}`} className="hover:underline">
                      {error.id}
                    </Link>
                  </TableCell>
                  <TableCell>{error.category}</TableCell>
                  <TableCell>{error.agent}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        error.status === 'Corrigido'
                          ? 'default'
                          : error.status === 'Em Análise'
                            ? 'secondary'
                            : 'outline'
                      }
                      className={
                        error.status === 'Em Análise'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 border-transparent'
                          : ''
                      }
                    >
                      {error.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
