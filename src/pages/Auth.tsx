import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquareWarning, Loader2, AlertCircle } from 'lucide-react'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'
import { MeshGradient } from '@/components/MeshGradient'

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signIn, signUp, loading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState(
    location.pathname === '/register' ? 'register' : 'login',
  )

  const [identity, setIdentity] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

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
    setLoginError(false)
    navigate(val === 'register' ? '/register' : '/login', { replace: true })
  }

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentity(e.target.value)
    if (loginError) setLoginError(false)
  }

  const handleLoginPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(e.target.value)
    if (loginError) setLoginError(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || authLoading || isSuccess) return
    setIsSubmitting(true)
    setFieldErrors({})
    setLoginError(false)

    const trimmedIdentity = identity.trim()
    const trimmedPassword = loginPassword.trim()

    const { error } = await signIn(trimmedIdentity, trimmedPassword)
    if (error) {
      setLoginError(true)
      toast.error('Usuário ou senha incorretos')
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
      <>
        {/* Layer 0: Animated Background */}
        <div className="fixed inset-0 z-0 bg-background pointer-events-none">
          <MeshGradient />
        </div>
        {/* Layer 1: Content */}
        <div className="min-h-screen flex items-center justify-center relative z-10 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      {/* Layer 0: Animated Background */}
      <div className="fixed inset-0 z-0 bg-background pointer-events-none">
        <MeshGradient />
      </div>

      {/* Layer 1: Content */}
      <div className="min-h-screen flex items-center justify-center relative z-10 p-4">
        <Card className="w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/20 bg-black/40 backdrop-blur-xl animate-fade-in-up text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
          <CardHeader className="space-y-2 text-center pb-6 relative z-10">
            <div className="mx-auto bg-primary w-14 h-14 flex items-center justify-center rounded-2xl mb-4 shadow-lg shadow-primary/30">
              <MessageSquareWarning className="w-7 h-7 text-black" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Agent<span className="font-light text-cyan-400">Pro</span>
            </CardTitle>
            <CardDescription className="text-white/60 font-medium">
              Sistema Integrado de Atendimento IA
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/30 border border-white/10 p-1 backdrop-blur-md rounded-lg">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-md text-white/60 rounded-md transition-all"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-md text-white/60 rounded-md transition-all"
                >
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                  {loginError && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <span>Usuário ou senha incorretos</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="identity" className="text-white/90">
                      E-mail ou Usuário
                    </Label>
                    <Input
                      id="identity"
                      type="text"
                      placeholder="E-mail ou Usuário"
                      value={identity}
                      onChange={handleIdentityChange}
                      required
                      autoComplete="username"
                      className={`bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:bg-black/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-sm shadow-inner ${loginError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90">
                      Senha
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={handleLoginPasswordChange}
                      required
                      autoComplete="current-password"
                      className={`bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:bg-black/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-sm shadow-inner ${loginError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full shadow-lg shadow-cyan-900/50 py-6 text-base font-semibold mt-6 bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/30 transition-all hover:scale-[1.02]"
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
                    <Label htmlFor="name" className="text-white/90">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="João Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={`bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:bg-black/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-sm shadow-inner ${fieldErrors.name ? 'border-red-500 focus-visible:ring-red-500 focus:ring-1 focus:ring-red-500' : ''}`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-400 font-medium">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white/90">
                      Usuário
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="joaosilva"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={`bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:bg-black/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-sm shadow-inner ${fieldErrors.username ? 'border-red-500 focus-visible:ring-red-500 focus:ring-1 focus:ring-red-500' : ''}`}
                    />
                    {fieldErrors.username && (
                      <p className="text-xs text-red-400 font-medium">{fieldErrors.username}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="joao@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:bg-black/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-sm shadow-inner ${fieldErrors.email ? 'border-red-500 focus-visible:ring-red-500 focus:ring-1 focus:ring-red-500' : ''}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-400 font-medium">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-white/90">
                        Senha
                      </Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        className={`bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:bg-black/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-sm shadow-inner ${fieldErrors.password ? 'border-red-500 focus-visible:ring-red-500 focus:ring-1 focus:ring-red-500' : ''}`}
                      />
                      {fieldErrors.password && (
                        <p className="text-xs text-red-400 font-medium">{fieldErrors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white/90">
                        Confirmar Senha
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:bg-black/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-sm shadow-inner ${fieldErrors.passwordConfirm ? 'border-red-500 focus-visible:ring-red-500 focus:ring-1 focus:ring-red-500' : ''}`}
                      />
                    </div>
                  </div>
                  {fieldErrors.passwordConfirm && (
                    <p className="text-xs text-red-400 font-medium">
                      {fieldErrors.passwordConfirm}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full shadow-lg shadow-cyan-900/50 py-6 text-base font-semibold mt-6 bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/30 transition-all hover:scale-[1.02]"
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
    </>
  )
}
