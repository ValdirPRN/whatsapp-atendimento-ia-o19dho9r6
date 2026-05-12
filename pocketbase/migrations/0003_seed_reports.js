migrate(
  (app) => {
    const reports = app.findCollectionByNameOrId('reports')
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'samuelklausfischer@hotmail.com')

      const seeds = [
        {
          title: 'Etiqueta incorreta atribuída',
          context: 'O cliente pediu renovação e a IA aplicou tag errada.',
          category: 'Filtro de etiquetas do WhatsApp',
          actual_behavior: 'A IA aplicou a etiqueta de suporte técnico.',
          expected_behavior: 'Deveria ter aplicado a etiqueta de vendas.',
          severity: 'Média',
          status: 'Em Análise',
        },
        {
          title: 'Falha na triagem médica',
          context: 'Paciente com dores agudas enviou mensagem no WhatsApp.',
          category: 'Triagem da conversa',
          actual_behavior: 'A IA mandou agendar para a próxima semana ignorando os sintomas.',
          expected_behavior:
            'Deveria ter alertado um atendente humano imediatamente para triagem urgente.',
          severity: 'Alta',
          status: 'Reportado',
        },
        {
          title: 'Erro leitura de hemograma',
          context: 'Paciente enviou PDF do laboratório.',
          category: 'Erro na leitura de exames',
          actual_behavior:
            'Os valores de glicose foram lidos na coluna de ureia, gerando confusão no resumo.',
          expected_behavior:
            'O parser da IA deveria alinhar corretamente a tabela de resultados do laboratório.',
          severity: 'Crítica',
          status: 'Corrigido',
        },
      ]

      for (const s of seeds) {
        try {
          app.findFirstRecordByData('reports', 'title', s.title)
        } catch (_) {
          const record = new Record(reports)
          record.set('user_id', user.id)
          record.set('title', s.title)
          record.set('context', s.context)
          record.set('category', s.category)
          record.set('actual_behavior', s.actual_behavior)
          record.set('expected_behavior', s.expected_behavior)
          record.set('severity', s.severity)
          record.set('status', s.status)
          app.save(record)
        }
      }
    } catch (_) {}
  },
  (app) => {},
)
