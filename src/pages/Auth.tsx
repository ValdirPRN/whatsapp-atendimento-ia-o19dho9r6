import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquareWarning, Loader2 } from 'lucide-react'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signIn, signUp, loading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState(
    location.pathname === '/register' ? 'register' : 'login',
  )

  const [identity, setIdentity] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleTabChange = (val: string) => {
    setActiveTab(val)
    setFieldErrors({})
    navigate(val === 'register' ? '/register' : '/login', { replace: true })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || authLoading || isSuccess) return
    setIsSubmitting(true)
    setFieldErrors({})

    const trimmedIdentity = identity.trim()
    const trimmedPassword = loginPassword.trim()

    const { error } = await signIn(trimmedIdentity, trimmedPassword)
    if (error) {
      const apiMsg = getErrorMessage(error)
      const errorMsg =
        apiMsg && apiMsg !== 'An unexpected error occurred.'
          ? apiMsg
          : 'Falha ao autenticar. Verifique suas credenciais.'
      toast.error(errorMsg)
      setIsSubmitting(false)
    } else {
      toast.success('Login realizado com sucesso!')
      setIsSuccess(true)
      navigate('/dashboard', { replace: true })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || authLoading || isSuccess) return

    setFieldErrors({})
    setIsSubmitting(true)

    const trimmedName = name.trim()
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()

    if (regPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      setFieldErrors({ passwordConfirm: 'As senhas não coincidem.' })
      setIsSubmitting(false)
      return
    }

    if (regPassword.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres.')
      setFieldErrors({ password: 'Mínimo de 8 caracteres.' })
      setIsSubmitting(false)
      return
    }

    const { error } = await signUp(trimmedName, trimmedUsername, trimmedEmail, regPassword)
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent z-0" />
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-primary/20 blur-[100px] opacity-60 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-primary/5 to-transparent z-0" />

      <Card className="w-full max-w-md shadow-2xl border-white/60 bg-white/90 backdrop-blur-md animate-fade-in-up z-10 relative">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto bg-primary w-14 h-14 flex items-center justify-center rounded-2xl mb-4 shadow-lg shadow-primary/30">
            <MessageSquareWarning className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Agent<span className="font-light opacity-70">Pro</span>
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Sistema Integrado de Atendimento IA
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="identity">E-mail ou Usuário</Label>
                  <Input
                    id="identity"
                    type="text"
                    placeholder="E-mail ou Usuário"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    required
                    autoComplete="username"
                    className="bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="bg-white/50 focus:bg-white transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full shadow-md py-6 text-base font-semibold mt-6"
                  disabled={isSubmitting || isSuccess}
                >
                  {isSubmitting || isSuccess ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isSuccess ? 'Redirecionando...' : 'Entrando...'}
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`bg-white/50 focus:bg-white transition-colors ${fieldErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500 font-medium">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="joaosilva"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={`bg-white/50 focus:bg-white transition-colors ${fieldErrors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {fieldErrors.username && (
                    <p className="text-xs text-red-500 font-medium">{fieldErrors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`bg-white/50 focus:bg-white transition-colors ${fieldErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Senha</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className={`bg-white/50 focus:bg-white transition-colors ${fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {fieldErrors.password && (
                      <p className="text-xs text-red-500 font-medium">{fieldErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`bg-white/50 focus:bg-white transition-colors ${fieldErrors.passwordConfirm ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                  </div>
                </div>
                {fieldErrors.passwordConfirm && (
                  <p className="text-xs text-red-500 font-medium">{fieldErrors.passwordConfirm}</p>
                )}

                <Button
                  type="submit"
                  className="w-full shadow-md py-6 text-base font-semibold mt-6"
                  disabled={isSubmitting || isSuccess}
                >
                  {isSubmitting || isSuccess ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isSuccess ? 'Redirecionando...' : 'Criando conta...'}
                    </>
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
