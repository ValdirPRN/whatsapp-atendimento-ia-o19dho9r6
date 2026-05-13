import { useState, useEffect } from 'react'
import { getUsers, createUser, deleteUser, User } from '@/services/users'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { Users, UserPlus, Shield, Trash2, Calendar, Fingerprint } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { format } from 'date-fns'

export default function EquipePage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const [formData, setFormData] = useState({ name: '', username: '', password: '' })
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
        name: formData.name,
        username: formData.username,
        email: `${formData.username}@agentpro.local`,
        password: formData.password,
        passwordConfirm: formData.password,
        role: 'member',
      })
      toast.success('Membro adicionado com sucesso!')
      setIsOpen(false)
      setFormData({ name: '', username: '', password: '' })
    } catch (e: any) {
      toast.error(e.message || 'Erro ao criar usuário')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id)
      toast.success('Usuário excluído com sucesso')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir usuário')
    }
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-md">
              <Users className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-cyan-500 drop-shadow-md">
              Gestão de <span className="font-light text-cyan-400">Equipe</span>
            </h1>
          </div>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl">
            Gerencie os membros da equipe que têm acesso ao painel do AgentPro.
          </p>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-cyan-500/20 bg-cyan-600 hover:bg-cyan-500 text-white transition-all ease-out h-11 px-6">
              <UserPlus className="w-4 h-4" /> Novo Membro
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-black/90 backdrop-blur-2xl border-white/10 text-white sm:max-w-md w-[400px]">
            <div className="flex flex-col space-y-2 text-left mb-6 mt-4">
              <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" /> Adicionar Membro
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
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-cyan-500"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Nome de Usuário (Username)
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''),
                    }))
                  }
                  required
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-cyan-500"
                  placeholder="Ex: joao.silva"
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
                  className="bg-black/50 border-white/10 text-white focus-visible:ring-cyan-500"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white mt-4"
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
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-medium">Usuário</TableHead>
                  <TableHead className="text-slate-400 font-medium">Username</TableHead>
                  <TableHead className="text-slate-400 font-medium">Função</TableHead>
                  <TableHead className="text-slate-400 font-medium">Criado em</TableHead>
                  <TableHead className="text-right text-slate-400 font-medium">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                          {u.name
                            ? u.name.charAt(0).toUpperCase()
                            : u.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white">{u.name || 'Sem nome'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                        <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300 text-sm capitalize">
                          {u.role || 'Member'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{format(new Date(u.created), 'dd/MM/yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {currentUser?.id !== u.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-950 border-white/10 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tem certeza que deseja excluir este usuário?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                Esta ação não pode ser desfeita. O usuário perderá o acesso ao
                                sistema permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(u.id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
