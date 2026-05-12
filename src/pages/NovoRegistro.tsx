import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, X, Send, Image as ImageIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { mockErrors } from '@/lib/mock-data'
import { AIError } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres.'),
  context: z.string().min(20, 'Descreva com mais detalhes o que ocorreu (mín. 20 caracteres).'),
  technicalNotes: z.string().optional(),
  category: z.string().min(1, 'Selecione uma categoria.'),
  severity: z.string().min(1, 'Selecione a prioridade.'),
})

export default function NovoRegistro() {
  const [images, setImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      context: '',
      technicalNotes: '',
      category: '',
      severity: 'Média',
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newFiles])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newError: AIError = {
      id: `ERR-${1043 + mockErrors.length}`,
      title: values.title,
      context: values.context,
      technicalNotes: values.technicalNotes,
      category: values.category as any,
      severity: values.severity as any,
      status: 'Reportado',
      agent: 'Você',
      date: new Date().toISOString(),
      images: images.map((file) => URL.createObjectURL(file)),
      timeline: [
        {
          id: Math.random().toString(),
          date: new Date().toISOString(),
          action: 'Erro reportado',
          user: 'Você',
        },
      ],
    }

    mockErrors.unshift(newError)

    toast({
      title: 'Registro enviado com sucesso!',
      description: 'O erro foi catalogado temporariamente na sessão local.',
    })

    setTimeout(() => {
      navigate('/historico')
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Relatar Novo Erro</h2>
        <p className="text-muted-foreground">
          Forneça detalhes e evidências sobre a falha do AgentPro para ajudar a equipe a corrigir o
          comportamento.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Problema</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: AgentPro respondeu em outro idioma"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Filtro de etiquetas do WhatsApp">
                            Filtro de etiquetas do WhatsApp
                          </SelectItem>
                          <SelectItem value="Triagem da conversa">Triagem da conversa</SelectItem>
                          <SelectItem value="Mensagens automáticas da IA">
                            Mensagens automáticas da IA
                          </SelectItem>
                          <SelectItem value="Erros sobre exames lidos de maneira errada">
                            Erros sobre exames lidos de maneira errada
                          </SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severidade / Prioridade</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value)
                          }}
                          className="justify-start bg-muted/50 p-1 rounded-md w-fit"
                        >
                          <ToggleGroupItem
                            value="Baixa"
                            aria-label="Baixa"
                            className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
                          >
                            Baixa
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="Média"
                            aria-label="Média"
                            className="data-[state=on]:bg-amber-100 data-[state=on]:text-amber-800 dark:data-[state=on]:bg-amber-900/50"
                          >
                            Média
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="Alta"
                            aria-label="Alta"
                            className="data-[state=on]:bg-orange-100 data-[state=on]:text-orange-800 dark:data-[state=on]:bg-orange-900/50"
                          >
                            Alta
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="Crítica"
                            aria-label="Crítica"
                            className="data-[state=on]:bg-red-100 data-[state=on]:text-red-800 dark:data-[state=on]:bg-red-900/50"
                          >
                            Crítica
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição e Contexto da Conversa</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o que o cliente enviou e qual foi a falha na IA do AgentPro..."
                        className="min-h-[100px] bg-background resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Copie e cole trechos da conversa se necessário.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technicalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Técnicas (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adicione detalhes técnicos úteis (ex: comportamento esperado, ID da sessão, tipo do exame)..."
                        className="min-h-[80px] bg-background resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Evidências (Capturas de Tela)
              </CardTitle>
              <CardDescription>
                Adicione screenshots da conversa no WhatsApp mostrando o erro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                <p className="font-medium">Clique para selecionar ou arraste imagens aqui</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou WEBP (Max. 5MB)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative group rounded-md overflow-hidden border border-border aspect-[9/16] bg-muted flex items-center justify-center"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="w-8 h-8 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeImage(index)
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" className="shadow-md">
              <Send className="w-4 h-4 mr-2" /> Salvar Registro
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
