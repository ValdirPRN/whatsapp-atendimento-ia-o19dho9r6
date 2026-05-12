export type ErrorCategory =
  | 'Resposta Incorreta'
  | 'Tom Inadequado'
  | 'Loop Infinito'
  | 'Falha de Contexto'
  | 'Alucinação de Produto'
  | 'Outro'

export type ErrorSeverity = 'Baixa' | 'Média' | 'Alta' | 'Crítica'

export type ErrorStatus = 'Reportado' | 'Em Análise' | 'Corrigido' | 'Ignorado'

export interface TimelineEvent {
  id: string
  date: string
  action: string
  user: string
  notes?: string
}

export interface AIError {
  id: string
  title: string
  context: string
  category: ErrorCategory
  severity: ErrorSeverity
  status: ErrorStatus
  agent: string
  date: string
  images: string[]
  timeline: TimelineEvent[]
}

export interface DailyStat {
  date: string
  errors: number
  resolved: number
}
