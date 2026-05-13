migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    let adminId

    try {
      adminId = app.findAuthRecordByEmail('users', 'samuelklausfischer@hotmail.com').id
    } catch (_) {
      // Fallback to the first user if the specific admin is not found
      const allUsers = app.findRecordsByFilter('users', '1=1', '-created', 1, 0)
      if (allUsers.length > 0) {
        adminId = allUsers[0].id
      } else {
        console.log('No users found. Skipping report seeding.')
        return
      }
    }

    const reportsData = [
      {
        title: 'Falha na transcrição de áudio longo',
        context: 'Cliente enviou um áudio de 5 minutos sobre resultados de exames.',
        category: 'Triagem da conversa',
        actual_behavior: 'A IA travou e não gerou o resumo da conversa.',
        expected_behavior:
          'A IA deveria transcrever e resumir os pontos principais do áudio em texto.',
        technical_notes: 'Timeout na API de transcrição.',
        severity: 'Alta',
        status: 'Reportado',
      },
      {
        title: 'Etiqueta errada para orçamento',
        context: 'Paciente perguntou o preço de uma ressonância magnética.',
        category: 'Filtro de etiquetas do WhatsApp',
        actual_behavior: "Atribuiu a etiqueta 'Dúvida Geral' em vez de 'Orçamento'.",
        expected_behavior: "Deveria identificar a intenção de compra e colocar 'Orçamento'.",
        technical_notes: 'O modelo falhou em detectar palavras-chave financeiras.',
        severity: 'Média',
        status: 'Em Análise',
      },
      {
        title: 'Mensagem de boas-vindas enviada duas vezes',
        context: "Novo contato iniciou a conversa com 'Olá'.",
        category: 'Mensagens automáticas',
        actual_behavior: 'O bot enviou a mensagem de saudação inicial duplicada no mesmo segundo.',
        expected_behavior: 'Enviar apenas uma única mensagem de boas-vindas por contato novo.',
        technical_notes: 'Pode ser um problema de concorrência ou webhook acionado em dobro.',
        severity: 'Média',
        status: 'Corrigido',
      },
      {
        title: 'Erro na leitura de exame PDF',
        context: 'Paciente enviou o resultado de sangue em formato PDF.',
        category: 'Erro na leitura de exames',
        actual_behavior: "A IA retornou 'Não foi possível ler o arquivo enviado'.",
        expected_behavior: 'A IA deve extrair o texto do PDF e confirmar o recebimento do exame.',
        technical_notes: 'Problema no parsing do layout do laboratório específico.',
        severity: 'Alta',
        status: 'Em Análise',
      },
      {
        title: 'Sistema offline e sem resposta',
        context: 'Pico de acessos na segunda-feira de manhã.',
        category: 'Performance',
        actual_behavior:
          'O bot parou de responder a todas as mensagens do WhatsApp por 15 minutos.',
        expected_behavior:
          'O sistema deve escalar automaticamente ou manter tempo de resposta abaixo de 5s.',
        technical_notes: 'Ocorreu gargalo no banco de dados, necessita de revisão de índices.',
        severity: 'Crítica',
        status: 'Reportado',
      },
    ]

    const reportsCollection = app.findCollectionByNameOrId('reports')

    for (const data of reportsData) {
      try {
        // Check if already exists to make migration idempotent
        app.findFirstRecordByData('reports', 'title', data.title)
      } catch (_) {
        const record = new Record(reportsCollection)
        record.set('user_id', adminId)
        record.set('title', data.title)
        record.set('context', data.context)
        record.set('category', data.category)
        record.set('actual_behavior', data.actual_behavior)
        record.set('expected_behavior', data.expected_behavior)
        record.set('technical_notes', data.technical_notes)
        record.set('severity', data.severity)
        record.set('status', data.status)
        app.save(record)
      }
    }
  },
  (app) => {
    const titles = [
      'Falha na transcrição de áudio longo',
      'Etiqueta errada para orçamento',
      'Mensagem de boas-vindas enviada duas vezes',
      'Erro na leitura de exame PDF',
      'Sistema offline e sem resposta',
    ]

    for (const title of titles) {
      try {
        const record = app.findFirstRecordByData('reports', 'title', title)
        app.delete(record)
      } catch (_) {}
    }
  },
)
