import pb from '@/lib/pocketbase/client'

import type { ReportRecord } from '@/lib/types'

export const getReports = (filter = '', sort = '-created') =>
  pb.collection('reports').getFullList<ReportRecord>({ filter, sort, expand: 'user_id' })

export const createReport = (data: Partial<ReportRecord>) =>
  pb.collection('reports').create<ReportRecord>(data)

export const updateReport = (id: string, data: Partial<ReportRecord>) =>
  pb.collection('reports').update<ReportRecord>(id, data)

export const deleteReport = (id: string) => pb.collection('reports').delete(id)
