import { Link } from 'react-router-dom'
import { Menu, LogOut, Plus, FileText, BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSidebar } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { toggleSidebar } = useSidebar()
  const { user, signOut } = useAuth()

  return (
    <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 w-full shadow-sm">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden text-white"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/" className="flex items-center gap-3 group">
          <svg
            viewBox="0 0 100 100"
            className="w-10 h-10 fill-cyan-400 filter-logo-glow transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110"
          >
            <path d="M15 85V15h12l18 35 18-35h12v70h-12V35L45 70h-10L17 35v50H15z" />
          </svg>
          <div className="hidden sm:flex flex-col justify-center">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Agent<span className="text-cyan-400">Pro</span>
            </span>
            <span className="text-[10px] text-cyan-400/70 font-medium uppercase tracking-wider mt-1">
              PRN - MEDimagem | IA Palhoça
            </span>
          </div>
        </Link>
      </div>

      <nav className="hidden lg:flex items-center gap-8">
        <Link
          to="/novo-registro"
          className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Registro
        </Link>
        <Link
          to="/historico"
          className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          <FileText className="w-4 h-4" /> Histórico
        </Link>
        <Link
          to="/documentacao"
          className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          <BookOpen className="w-4 h-4" /> Documentação
        </Link>
      </nav>

      <div className="flex items-center gap-4 justify-end">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-cyan-500 transition-all filter-logo-glow">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name || 'Agent'} />
                ) : (
                  <AvatarFallback className="bg-cyan-500/20 text-cyan-400">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-black/90 backdrop-blur-md border-white/10"
            >
              <DropdownMenuItem
                onClick={signOut}
                className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-400/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="relative flex items-center w-28 h-10 group">
            {/* Gooey Filter Applied Background */}
            <div className="absolute inset-0 w-full h-full filter-gooey -z-10 pointer-events-none">
              <div className="absolute inset-0 bg-cyan-500 rounded-full" />
              <div className="absolute top-0 right-0 bg-cyan-500 w-10 h-10 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-10" />
            </div>
            {/* Interactive Elements (No SVG Filters) */}
            <Link
              to="/login"
              className="absolute inset-0 flex items-center justify-center text-black font-bold z-10 text-sm hover:scale-105 transition-transform duration-300"
            >
              Login
            </Link>
            <div className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-10 z-10 opacity-0 group-hover:opacity-100 pointer-events-none">
              <ArrowRight className="w-4 h-4 text-black" />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
