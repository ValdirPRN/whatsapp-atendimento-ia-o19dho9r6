import pb from '@/lib/pocketbase/client'

export interface Report {
  id: string
  title: string
  category: string
  actual_behavior: string
  expected_behavior: string
  severity: 'Baixa' | 'Média' | 'Alta' | 'Crítica'
  status: 'Reportado' | 'Em Análise' | 'Corrigido'
  user_id: string
  created: string
  updated: string
  expand?: {
    user_id?: {
      name: string
      email: string
    }
  }
}

export const getReports = (filter = '', sort = '-created') =>
  pb.collection('reports').getFullList<Report>({ filter, sort, expand: 'user_id' })

export const createReport = (data: Partial<Report>) => pb.collection('reports').create<Report>(data)

export const updateReport = (id: string, data: Partial<Report>) =>
  pb.collection('reports').update<Report>(id, data)

export const deleteReport = (id: string) => pb.collection('reports').delete(id)
