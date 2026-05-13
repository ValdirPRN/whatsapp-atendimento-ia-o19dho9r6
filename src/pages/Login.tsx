import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquareWarning, Loader2 } from 'lucide-react'
import { useNavigate, Navigate } from 'react-router-dom'
import { toast } from 'sonner'

export function Login() {
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { user, signIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || authLoading || isSuccess) return

    setIsSubmitting(true)

    const trimmedIdentity = identity.trim()
    const trimmedPassword = password.trim()

    let loginIdentity = trimmedIdentity
    if (!loginIdentity.includes('@')) {
      loginIdentity = loginIdentity.replace(/\s+/g, '_').toLowerCase()
    }

    const { error } = await signIn(loginIdentity, trimmedPassword)
    if (error) {
      toast.error('Login failed: Invalid username or password.')
      setIsSubmitting(false)
    } else {
      toast.success('Login realizado com sucesso!')
      setIsSuccess(true)
      navigate('/dashboard', { replace: true })
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
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
            <Button type="submit" className="w-full shadow-sm" disabled={isSubmitting || isSuccess}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : isSuccess ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecionando para o painel...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
            {isSuccess && (
              <p className="text-sm text-center text-muted-foreground animate-fade-in">
                Login concluído. Aguardando redirecionamento...
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
