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
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { user, signUp, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || authLoading || isSuccess) return

    setFieldErrors({})
    setIsSubmitting(true)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      setIsSubmitting(false)
      return
    }

    if (password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres.')
      setIsSubmitting(false)
      return
    }

    const { error } = await signUp(trimmedName, trimmedEmail, password)
    if (error) {
      const errors = extractFieldErrors(error)
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        toast.error('Verifique os campos destacados e tente novamente.')
      } else {
        const apiMsg = getErrorMessage(error)
        const errorMsg =
          apiMsg && apiMsg !== 'An unexpected error occurred.'
            ? apiMsg
            : 'Falha ao criar conta. Tente novamente mais tarde.'

        toast.error(errorMsg)
      }
      setIsSubmitting(false)
    } else {
      toast.success('Conta criada com sucesso!')
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
            Criar Conta
          </CardTitle>
          <CardDescription className="text-slate-500">
            Preencha seus dados para começar a usar o AgentPro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`bg-white ${fieldErrors.name ? 'border-red-500' : ''}`}
              />
              {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`bg-white ${fieldErrors.email ? 'border-red-500' : ''}`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha (mínimo 8 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`bg-white ${fieldErrors.password ? 'border-red-500' : ''}`}
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`bg-white ${fieldErrors.passwordConfirm ? 'border-red-500' : ''}`}
              />
              {fieldErrors.passwordConfirm && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.passwordConfirm}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full shadow-sm py-6 text-base mt-2"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando conta...
                </>
              ) : isSuccess ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline hover:text-primary/80 transition-colors"
            >
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
