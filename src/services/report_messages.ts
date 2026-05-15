import pb from '@/lib/pocketbase/client'
import type { ReportMessage } from '@/lib/types'

export const getReportMessages = (reportId: string) =>
  pb.collection('report_messages').getFullList<ReportMessage>({
    filter: `report_id = "${reportId}"`,
    sort: 'created',
    expand: 'user_id',
  })

export const createReportMessage = (data: Partial<ReportMessage>) =>
  pb.collection('report_messages').create<ReportMessage>(data)

export const updateReportMessage = (id: string, data: Partial<ReportMessage>) =>
  pb.collection('report_messages').update<ReportMessage>(id, data)

export const deleteReportMessage = (id: string) => pb.collection('report_messages').delete(id)
