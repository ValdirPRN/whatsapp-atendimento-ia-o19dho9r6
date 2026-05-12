import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center space-y-6 animate-in fade-in duration-500">
      <div className="bg-muted p-6 rounded-full">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Página não encontrada</h1>
        <p className="text-muted-foreground max-w-[500px] mx-auto">
          Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido
          movida ou não existe mais.
        </p>
      </div>
      <Button onClick={() => navigate('/')} size="lg">
        Voltar para o início
      </Button>
    </div>
  )
}
