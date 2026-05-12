import { DailyStat, ReportRecord } from './types'

export const mockErrors: ReportRecord[] = [
  {
    id: '1',
    title: 'Etiqueta incorreta atribuída',
    context: 'O cliente pediu renovação e a IA aplicou tag errada.',
    category: 'Filtro de etiquetas do WhatsApp',
    actual_behavior: 'A IA aplicou a etiqueta de suporte técnico.',
    expected_behavior: 'Deveria ter aplicado a etiqueta de vendas.',
    severity: 'Média',
    status: 'Em Análise',
    user_id: '1',
    images: [],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Falha na triagem médica',
    context: 'Paciente com dores agudas enviou mensagem no WhatsApp.',
    category: 'Triagem da conversa',
    actual_behavior: 'A IA mandou agendar para a próxima semana ignorando os sintomas.',
    expected_behavior:
      'Deveria ter alertado um atendente humano imediatamente para triagem urgente.',
    severity: 'Alta',
    status: 'Reportado',
    user_id: '1',
    images: [],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
]

export const mockChartData: DailyStat[] = [
  { date: '10/18', errors: 12, resolved: 8 },
  { date: '10/19', errors: 15, resolved: 10 },
  { date: '10/20', errors: 8, resolved: 14 },
  { date: '10/21', errors: 22, resolved: 12 },
  { date: '10/22', errors: 18, resolved: 20 },
  { date: '10/23', errors: 14, resolved: 15 },
  { date: '10/24', errors: 9, resolved: 11 },
]
