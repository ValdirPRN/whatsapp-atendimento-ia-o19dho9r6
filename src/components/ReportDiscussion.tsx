import { useState, useEffect, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { getReportMessages, createReportMessage } from '@/services/report_messages'
import { useRealtime } from '@/hooks/use-realtime'
import { cn } from '@/lib/utils'
import type { ReportMessage } from '@/lib/types'
import { toast } from 'sonner'

interface ReportDiscussionProps {
  reportId: string
}

export function ReportDiscussion({ reportId }: ReportDiscussionProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ReportMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const loadMessages = async () => {
    try {
      const data = await getReportMessages(reportId)
      setMessages(data)
    } catch (err) {
      console.error('Error loading messages', err)
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [reportId])

  useRealtime('report_messages', () => {
    loadMessages()
  })

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setLoading(true)
    try {
      await createReportMessage({
        report_id: reportId,
        user_id: user.id,
        content: newMessage.trim(),
      })
      setNewMessage('')
    } catch (err) {
      toast.error('Erro ao enviar mensagem.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isDev = user?.role === 'dev' || user?.role === 'admin'
  const placeholder = isDev ? 'Tire uma dúvida com o relator...' : 'Responda ao desenvolvedor...'

  return (
    <div className="flex flex-col h-[400px] border border-white/10 rounded-lg bg-black/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 bg-white/5">
        <h4 className="text-sm font-semibold text-slate-200">Comunicação</h4>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {initialLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-8">
            Nenhuma mensagem ainda. Inicie a conversa!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const msgUser = msg.expand?.user_id
              const isSender = msgUser?.id === user?.id
              const senderIsDev = msgUser?.role === 'dev' || msgUser?.role === 'admin'

              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col max-w-[85%]',
                    isSender ? 'ml-auto items-end' : 'mr-auto items-start',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!isSender && (
                      <span className="text-xs font-medium text-slate-400">
                        {msgUser?.name || 'Usuário'}
                      </span>
                    )}
                    {senderIsDev && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-4 border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shadow-none"
                      >
                        DEV
                      </Badge>
                    )}
                    {isSender && <span className="text-xs font-medium text-slate-400">Você</span>}
                  </div>

                  <div
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm break-words',
                      isSender
                        ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/20 rounded-tr-sm'
                        : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-sm',
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {format(new Date(msg.created), 'dd MMM, HH:mm', { locale: ptBR })}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={placeholder}
          className="bg-black/50 border-white/10 text-sm focus-visible:ring-cyan-500 text-slate-200"
          disabled={loading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newMessage.trim() || loading}
          className="shrink-0 bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  )
}
