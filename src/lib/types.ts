export type ErrorCategory =
  | 'Filtro de etiquetas do WhatsApp'
  | 'Triagem da conversa'
  | 'Mensagens automáticas'
  | 'Erro na leitura de exames'
  | string

export type ErrorSeverity = 'Baixa' | 'Média' | 'Alta' | 'Crítica' | string

export type ErrorStatus =
  | 'Reportado'
  | 'Em análise'
  | 'Aguardando validação'
  | 'Problema resolvido'
  | 'Problema não corrigido'
  | 'Concluído'
  | string

export interface TimelineEvent {
  id: string
  date: string
  action: string
  user: string
  notes?: string
}

export interface ReportRecord {
  id: string
  title: string
  context: string
  actual_behavior: string
  expected_behavior: string
  technical_notes?: string
  category: ErrorCategory
  severity: ErrorSeverity
  status: ErrorStatus
  user_id: string
  images: string[]
  created: string
  updated: string
  expand?: {
    user_id?: {
      id: string
      name: string
      email: string
      avatar?: string
    }
  }
  // Optional backward compatibility
  agent?: string
  timeline?: TimelineEvent[]
}

export type AIError = ReportRecord

export interface DailyStat {
  date: string
  errors: number
  resolved: number
}
