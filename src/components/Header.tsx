import { Bell, Search, Menu, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSidebar } from '@/components/ui/sidebar'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const routeTitles: Record<string, string> = {
  '/': 'Painel de Controle',
  '/historico': 'Histórico de Erros',
  '/novo-registro': 'Registrar Novo Erro',
  '/configuracoes': 'Configurações do Sistema',
}

export function Header() {
  const { toggleSidebar } = useSidebar()
  const location = useLocation()
  const { user, signOut } = useAuth()

  // Try to match exact route or fallback to details
  const title =
    routeTitles[location.pathname] ||
    (location.pathname.startsWith('/erro/') ? 'Detalhes do Erro' : 'AgentPro')

  return (
    <header className="h-16 border-b border-border/50 bg-background flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 w-full shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-tight text-foreground hidden sm:block">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="relative w-full max-w-[300px] hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por ID, agente ou palavra-chave..."
            className="w-full bg-muted/50 pl-9 rounded-full border-none focus-visible:ring-1"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-background"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user?.name || 'Agent'} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={signOut}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
