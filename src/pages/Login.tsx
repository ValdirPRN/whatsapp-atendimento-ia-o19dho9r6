import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquareWarning } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function Login() {
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    let loginIdentity = identity.trim()
    if (!loginIdentity.includes('@')) {
      loginIdentity = loginIdentity.replace(/\s+/g, '_').toLowerCase()
    }

    const { error } = await signIn(loginIdentity, password)
    if (error) {
      toast.error('Falha na autenticação. Verifique seu usuário e senha.')
    } else {
      toast.success('Login realizado com sucesso!')
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50 animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-primary w-12 h-12 flex items-center justify-center rounded-xl mb-4 shadow-sm">
            <MessageSquareWarning className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Agent<span className="font-light opacity-70">Pro</span>
          </CardTitle>
          <CardDescription>Faça login para acessar o painel de controle</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Usuário ou Email (ex: Paulo novack)"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                required
                autoComplete="username"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full shadow-sm" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
