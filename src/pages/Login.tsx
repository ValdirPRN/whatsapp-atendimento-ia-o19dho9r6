import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { MessageSquareWarning, Loader2 } from 'lucide-react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/pocketbase/errors'

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

    const { error } = await signIn(trimmedIdentity, trimmedPassword)
    if (error) {
      const apiMsg = getErrorMessage(error)
      const errorMsg =
        apiMsg && apiMsg !== 'An unexpected error occurred.'
          ? apiMsg
          : 'Falha ao autenticar. Verifique suas credenciais ou crie uma conta.'

      toast.error(errorMsg)
      setIsSubmitting(false)
    } else {
      toast.success('Login realizado com sucesso!')
      setIsSuccess(true)
      navigate('/dashboard', { replace: true })
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="w-full max-w-md shadow-xl border-white/50 bg-white/80 backdrop-blur-sm animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-primary w-14 h-14 flex items-center justify-center rounded-2xl mb-4 shadow-md">
            <MessageSquareWarning className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Agent<span className="font-light opacity-70">Pro</span>
          </CardTitle>
          <CardDescription className="text-slate-500">
            Faça login para acessar o painel de controle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="E-mail ou Usuário"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                required
                autoComplete="username"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full shadow-sm py-6 text-base"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : isSuccess ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline hover:text-primary/80 transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
