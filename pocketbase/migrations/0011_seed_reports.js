migrate(
  (app) => {
    const reportsCol = app.findCollectionByNameOrId('reports')

    let adminId = ''
    try {
      const admin = app.findFirstRecordByData('_pb_users_auth_', 'username', 'admin')
      adminId = admin.id
    } catch (_) {
      try {
        const fb = app.findFirstRecordByData(
          '_pb_users_auth_',
          'email',
          'samuelklausfischer@hotmail.com',
        )
        adminId = fb.id
      } catch (_) {}
    }

    const reports = [
      {
        title: 'Mensagem de 10min',
        context: 'Mensagem de 10min',
        actual_behavior:
          'após 10 minutos sem a resposta do paciente vem a pergunta se o paciente ainda está ali.',
        expected_behavior:
          'essa mensagem deve ser enviada em um tempo maior para evitar de ter spam na conversa. Tempo sugerido: 30min a 1 hora.',
        category: 'Triagem da conversa',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        title: 'Mensagem sem contexto',
        context: 'Mensagem sem contexto',
        actual_behavior:
          'se o paciente enviar uma mensagem sem contexto a IA acaba inventando algo.',
        expected_behavior:
          'se a mensagem nao possui contexto a IA deve fazer perguntas ou pedir para o paciente esclarecer.',
        category: 'Triagem da conversa',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        title: 'Conversa concluída',
        context: 'Conversa concluída',
        actual_behavior:
          'ao finalizar uma conversa e eventualmente o mesmo paciente venha conversar novamente ele acaba caindo para a ultima atendente.',
        expected_behavior:
          "ao finalizar a conversa e o mesmo paciente vier mandar mensagem novamente, devera cair em 'geral' para qualquer atendente poder atender essa paciente.",
        category: 'Triagem da conversa',
        severity: 'Alta',
        status: 'Reportado',
      },
      {
        title: 'Filtro de etiquetas',
        context: 'Filtro de etiquetas',
        actual_behavior: 'e marcou mamografia SISREG',
        expected_behavior: 'ultrassom obstétrica com Doppler',
        category: 'Filtro de etiquetas do WhatsApp',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        title: 'Filtro de etiquetas',
        context: 'Filtro de etiquetas',
        actual_behavior: 'etiquetas sendo marcadas erradas',
        expected_behavior: 'deveria ser Tomografia Tórax',
        category: 'Filtro de etiquetas do WhatsApp',
        severity: 'Média',
        status: 'Reportado',
      },
    ]

    for (const r of reports) {
      try {
        app.findFirstRecordByData('reports', 'actual_behavior', r.actual_behavior)
      } catch (_) {
        const record = new Record(reportsCol)
        if (adminId) record.set('user_id', adminId)
        record.set('title', r.title)
        record.set('context', r.context)
        record.set('actual_behavior', r.actual_behavior)
        record.set('expected_behavior', r.expected_behavior)
        record.set('category', r.category)
        record.set('severity', r.severity)
        record.set('status', r.status)
        app.save(record)
      }
    }
  },
  (app) => {
    const actualBehaviors = [
      'após 10 minutos sem a resposta do paciente vem a pergunta se o paciente ainda está ali.',
      'se o paciente enviar uma mensagem sem contexto a IA acaba inventando algo.',
      'ao finalizar uma conversa e eventualmente o mesmo paciente venha conversar novamente ele acaba caindo para a ultima atendente.',
      'e marcou mamografia SISREG',
      'etiquetas sendo marcadas erradas',
    ]

    for (const ab of actualBehaviors) {
      try {
        const record = app.findFirstRecordByData('reports', 'actual_behavior', ab)
        app.delete(record)
      } catch (_) {}
    }
  },
)
