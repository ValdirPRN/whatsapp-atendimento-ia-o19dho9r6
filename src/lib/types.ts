export type ErrorCategory =
  | 'Filtro de etiquetas do WhatsApp'
  | 'Triagem da conversa'
  | 'Mensagens automáticas da IA'
  | 'Erros sobre exames lidos de maneira errada'
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
  aiErrorDescription?: string
  expectedBehavior?: string
  technicalNotes?: string
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
