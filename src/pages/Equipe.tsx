import { useState, useEffect } from 'react'
import { getUsers, createUser, User } from '@/services/users'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { Users, UserPlus, Mail, Shield } from 'lucide-react'

export default function EquipePage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const loadUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (e) {
      toast.error('Erro ao carregar equipe')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useRealtime('users', () => {
    loadUsers()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createUser({
        ...formData,
        passwordConfirm: formData.password,
      })
      toast.success('Membro adicionado com sucesso!')
      setIsOpen(false)
      setFormData({ name: '', email: '', password: '' })
    } catch (e: any) {
      toast.error(e.message || 'Erro ao criar usuário')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-purple-500 drop-shadow-md">
              Gestão de <span className="font-light text-purple-400">Equipe</span>
            </h1>
          </div>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl">
            Gerencie os membros da equipe que têm acesso ao painel do AgentPro.
          </p>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-500 text-white transition-all ease-out h-11 px-6">
              <UserPlus className="w-4 h-4" /> Novo Membro
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-black/90 backdrop-blur-2xl border-white/10 text-white sm:max-w-md w-[400px]">
            <div className="flex flex-col space-y-2 text-left mb-6 mt-4">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" /> Adicionar Membro
              </h2>
              <p className="text-sm text-slate-400">
                Preencha os dados abaixo para criar um novo acesso ao sistema.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-purple-500"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-purple-500"
                  placeholder="joao@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Senha Provisória
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  required
                  minLength={8}
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-purple-500"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white mt-4"
                disabled={submitting}
              >
                {submitting ? 'Criando...' : 'Criar Conta'}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="shadow-xl bg-black/60 backdrop-blur-xl border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4 bg-black/20">
          <CardTitle className="text-xl text-white">Membros Ativos</CardTitle>
          <CardDescription className="text-slate-400 mt-1">
            Lista de todos os usuários com acesso ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-slate-400 animate-pulse">
              Carregando equipe...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-slate-400">Nenhum membro encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                    {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden w-full">
                    <h3 className="text-white font-medium truncate">{u.name || 'Sem nome'}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-2">
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      <span>Acesso Padrão</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
