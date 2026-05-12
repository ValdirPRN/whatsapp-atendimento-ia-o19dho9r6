import { AIError, DailyStat } from './types'

export const mockErrors: AIError[] = [
  {
    id: 'ERR-1042',
    title: 'IA ofereceu desconto não autorizado',
    context:
      'O cliente perguntou sobre promoções e a IA inventou um cupom de 50% de desconto chamado "METADEDOPRECO" que não existe em nossa base.',
    category: 'Alucinação de Produto',
    severity: 'Alta',
    status: 'Em Análise',
    agent: 'Ana Silva',
    date: '2023-10-24T14:30:00Z',
    images: [
      'https://img.usecurling.com/p/400/800?q=whatsapp%20chat&color=green',
      'https://img.usecurling.com/p/400/800?q=whatsapp%20message&color=gray',
    ],
    timeline: [
      { id: 't1', date: '2023-10-24T14:30:00Z', action: 'Erro reportado', user: 'Ana Silva' },
      {
        id: 't2',
        date: '2023-10-24T15:00:00Z',
        action: 'Status alterado para Em Análise',
        user: 'Carlos Dev',
        notes: 'Verificando os logs do prompt.',
      },
    ],
  },
  {
    id: 'ERR-1041',
    title: 'Looping perguntando o nome do cliente',
    context:
      'A IA não reconheceu que o cliente já havia dito o nome na mensagem anterior e perguntou o nome 3 vezes seguidas.',
    category: 'Loop Infinito',
    severity: 'Média',
    status: 'Corrigido',
    agent: 'Roberto Alves',
    date: '2023-10-23T09:15:00Z',
    images: ['https://img.usecurling.com/p/400/800?q=smartphone%20screen'],
    timeline: [
      { id: 't3', date: '2023-10-23T09:15:00Z', action: 'Erro reportado', user: 'Roberto Alves' },
      {
        id: 't4',
        date: '2023-10-23T16:20:00Z',
        action: 'Status alterado para Corrigido',
        user: 'Equipe de IA',
        notes: 'Ajuste feito no rastreamento de entidades da sessão.',
      },
    ],
  },
  {
    id: 'ERR-1040',
    title: 'Tom muito ríspido após reclamação',
    context:
      'Cliente reclamou do atraso na entrega e a IA respondeu de forma robótica e insensível, sem empatia.',
    category: 'Tom Inadequado',
    severity: 'Alta',
    status: 'Reportado',
    agent: 'Mariana Costa',
    date: '2023-10-23T18:45:00Z',
    images: [],
    timeline: [
      { id: 't5', date: '2023-10-23T18:45:00Z', action: 'Erro reportado', user: 'Mariana Costa' },
    ],
  },
  {
    id: 'ERR-1039',
    title: 'Falha ao identificar intenção de cancelamento',
    context: 'Cliente digitou "quero cancelar minha conta" e a IA ofereceu um upgrade de plano.',
    category: 'Falha de Contexto',
    severity: 'Crítica',
    status: 'Em Análise',
    agent: 'João Mendes',
    date: '2023-10-22T11:10:00Z',
    images: ['https://img.usecurling.com/p/400/800?q=text%20message'],
    timeline: [
      { id: 't6', date: '2023-10-22T11:10:00Z', action: 'Erro reportado', user: 'João Mendes' },
    ],
  },
  {
    id: 'ERR-1038',
    title: 'Resposta em espanhol para cliente brasileiro',
    context: 'Do nada a IA começou a responder em espanhol no meio do atendimento.',
    category: 'Resposta Incorreta',
    severity: 'Média',
    status: 'Corrigido',
    agent: 'Ana Silva',
    date: '2023-10-21T10:00:00Z',
    images: ['https://img.usecurling.com/p/400/800?q=chat%20app&color=blue'],
    timeline: [
      { id: 't7', date: '2023-10-21T10:00:00Z', action: 'Erro reportado', user: 'Ana Silva' },
      {
        id: 't8',
        date: '2023-10-21T14:00:00Z',
        action: 'Status alterado para Corrigido',
        user: 'Carlos Dev',
      },
    ],
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
