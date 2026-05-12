import { AIError, DailyStat } from './types'

export const mockErrors: AIError[] = [
  {
    id: 'ERR-1042',
    title: 'Etiqueta incorreta atribuída ao cliente VIP',
    context:
      'O cliente entrou em contato para renovação e o sistema aplicou a etiqueta de suporte técnico em vez de vendas VIP.',
    category: 'Filtro de etiquetas do WhatsApp',
    severity: 'Média',
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
        notes: 'Verificando as regras de regex do filtro.',
      },
    ],
  },
  {
    id: 'ERR-1041',
    title: 'Encaminhamento falho na triagem inicial',
    context:
      'A IA não conseguiu entender a solicitação de agendamento e enviou para o departamento financeiro.',
    category: 'Triagem da conversa',
    severity: 'Alta',
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
        user: 'Equipe AgentPro',
        notes: 'Ajuste feito no prompt de roteamento.',
      },
    ],
  },
  {
    id: 'ERR-1040',
    title: 'Erro de leitura do exame de sangue',
    context:
      'O paciente enviou o PDF do hemograma e a IA interpretou os valores de glicemia de forma trocada, gerando uma orientação inadequada.',
    technicalNotes:
      'O parser de PDF falhou ao ler a coluna da direita do documento do laboratório X.',
    category: 'Erros sobre exames lidos de maneira errada',
    severity: 'Crítica',
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
    title: 'Mensagem de boas-vindas disparada duas vezes',
    context:
      'Assim que o cliente enviou "Olá", a IA enviou o menu principal, e 5 segundos depois, enviou o mesmo menu novamente.',
    category: 'Mensagens automáticas da IA',
    severity: 'Baixa',
    status: 'Em Análise',
    agent: 'João Mendes',
    date: '2023-10-22T11:10:00Z',
    images: ['https://img.usecurling.com/p/400/800?q=text%20message'],
    timeline: [
      { id: 't6', date: '2023-10-22T11:10:00Z', action: 'Erro reportado', user: 'João Mendes' },
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
