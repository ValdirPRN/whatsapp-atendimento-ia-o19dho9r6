import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, X, Send, Image as ImageIcon, CheckCircle } from 'lucide-react'
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
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

const formSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres.'),
  context: z.string().optional().or(z.literal('')),
  actual_behavior: z.string().min(5, 'Descreva o que a IA fez de errado.'),
  expected_behavior: z.string().min(5, 'Descreva o que a IA deveria ter feito.'),
  technical_notes: z.string().optional().or(z.literal('')),
  category: z.string().min(1, 'Selecione uma categoria.'),
  severity: z.string().min(1, 'Selecione a prioridade.'),
})

export default function NovoRegistro() {
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      context: '',
      actual_behavior: '',
      expected_behavior: '',
      technical_notes: '',
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      if (values.context) formData.append('context', values.context)
      formData.append('category', values.category)
      formData.append('actual_behavior', values.actual_behavior)
      formData.append('expected_behavior', values.expected_behavior)
      if (values.technical_notes) formData.append('technical_notes', values.technical_notes)
      formData.append('severity', values.severity)
      formData.append('status', 'Reportado')
      formData.append('user_id', user?.id || '')

      images.forEach((file) => {
        formData.append('images', file)
      })

      await pb.collection('reports').create(formData)

      toast({
        title: 'Registro enviado com sucesso!',
        description: 'O erro foi catalogado de forma segura no banco de dados.',
      })

      setTimeout(() => {
        navigate('/historico')
      }, 1500)
    } catch (error) {
      console.error(error)
      const fieldErrors = extractFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          form.setError(field as any, { type: 'server', message })
        })
        toast({
          title: 'Erro de validação',
          description: 'Verifique os campos preenchidos e tente novamente.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro ao salvar registro',
          description: 'Ocorreu um erro ao enviar os dados. Tente novamente.',
          variant: 'destructive',
        })
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up pb-10">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Relatar Novo Erro</h2>
        <p className="text-slate-300">
          Forneça detalhes e evidências sobre a falha do AgentPro para ajudar a equipe a corrigir o
          comportamento.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-lg border-slate-700 bg-black/60 backdrop-blur-xl text-white">
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
                        className="bg-black/50 border-slate-700 placeholder:text-slate-400 text-white focus-visible:ring-cyan-500 focus-visible:border-cyan-500"
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
                          <SelectTrigger className="bg-black/50 border-slate-700 text-white focus:ring-cyan-500">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Filtro de etiquetas do WhatsApp">
                            Filtro de etiquetas do WhatsApp
                          </SelectItem>
                          <SelectItem value="Triagem da conversa">Triagem da conversa</SelectItem>
                          <SelectItem value="Mensagens automáticas">
                            Mensagens automáticas
                          </SelectItem>
                          <SelectItem value="Erro na leitura de exames">
                            Erro na leitura de exames
                          </SelectItem>
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
                          className="justify-start bg-black/50 border border-slate-700 p-1 rounded-md w-fit"
                        >
                          <ToggleGroupItem
                            value="Baixa"
                            aria-label="Baixa"
                            className="text-slate-300 hover:text-white data-[state=on]:bg-slate-700 data-[state=on]:text-white data-[state=on]:shadow-sm"
                          >
                            Baixa
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="Média"
                            aria-label="Média"
                            className="text-slate-300 hover:text-white data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900 font-medium"
                          >
                            Média
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="Alta"
                            aria-label="Alta"
                            className="text-slate-300 hover:text-white data-[state=on]:bg-orange-100 data-[state=on]:text-orange-900 font-medium"
                          >
                            Alta
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="Crítica"
                            aria-label="Crítica"
                            className="text-slate-300 hover:text-white data-[state=on]:bg-red-100 data-[state=on]:text-red-900 font-medium"
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
                name="actual_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comportamento Real (O que a IA fez)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva exatamente o comportamento incorreto da IA..."
                        className="min-h-[100px] bg-black/50 border-slate-700 placeholder:text-slate-400 text-white focus-visible:ring-cyan-500 focus-visible:border-cyan-500 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expected_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comportamento Esperado (O que deveria ter ocorrido)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o que era esperado que a IA fizesse nesta situação..."
                        className="min-h-[100px] bg-black/50 border-slate-700 placeholder:text-slate-400 text-white focus-visible:ring-cyan-500 focus-visible:border-cyan-500 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição e Contexto da Conversa (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o que o cliente enviou e qual foi a falha na IA do AgentPro..."
                        className="min-h-[100px] bg-black/50 border-slate-700 placeholder:text-slate-400 text-white focus-visible:ring-cyan-500 focus-visible:border-cyan-500 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400">
                      Copie e cole trechos da conversa se necessário.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technical_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Técnicas (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Adicione detalhes técnicos úteis (ex: comportamento esperado, ID da sessão, tipo do exame)..."
                        className="min-h-[80px] bg-black/50 border-slate-700 placeholder:text-slate-400 text-white focus-visible:ring-cyan-500 focus-visible:border-cyan-500 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-slate-700 bg-black/60 backdrop-blur-xl text-white mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Evidências (Capturas de Tela)
              </CardTitle>
              <CardDescription className="text-slate-300">
                Adicione screenshots da conversa no WhatsApp mostrando o erro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-slate-600 bg-black/30 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/50 hover:border-cyan-500/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-10 h-10 text-cyan-400 mb-4" />
                <p className="font-medium text-slate-200">
                  Clique para selecionar ou arraste imagens aqui
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG ou WEBP (Max. 5MB)</p>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="shadow-md" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">Processando...</span>
              ) : (
                <span className="flex items-center">
                  <Send className="w-4 h-4 mr-2" /> Salvar Registro
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
