migrate(
  (app) => {
    const reportsCol = app.findCollectionByNameOrId('reports')
    let adminRecord = null

    try {
      adminRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'admin@example.com')
    } catch (_) {
      try {
        adminRecord = app.findFirstRecordByData('_pb_users_auth_', 'username', 'admin')
      } catch (_) {}
    }

    const adminId = adminRecord ? adminRecord.id : null

    if (!adminId) {
      console.log('No admin record found, skipping report seeds')
      return
    }

    const reports = [
      {
        title: 'Mensagem de 10min',
        category: 'Triagem da conversa',
        actual_behavior:
          'após 10 minutos sem a resposta do paciente vem a pergunta se o paciente ainda está ali.',
        expected_behavior: 'Tempo sugerido: 30min a 1 hora.',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        title: 'Mensagem sem contexto',
        category: 'Triagem da conversa',
        actual_behavior:
          'se o paciente enviar uma mensagem sem contexto a IA acaba inventando algo.',
        expected_behavior:
          'se a mensagem nao possui contexto a IA deve fazer perguntas ou pedir para o paciente esclarecer.',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        title: 'Conversa concluída',
        category: 'Triagem da conversa',
        actual_behavior:
          'ao finalizar uma conversa e eventualmente o mesmo paciente venha conversar novamente ele acaba caindo para a ultima atendente.',
        expected_behavior:
          "devera cair em 'geral' para qualquer atendente poder atender essa paciente.",
        severity: 'Alta',
        status: 'Reportado',
      },
      {
        title: 'Filtro de etiquetas',
        category: 'Filtro de etiquetas do WhatsApp',
        actual_behavior: 'e marcou mamografia SISREG',
        expected_behavior: 'ultrassom obstétrica com Doppler',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        title: 'Filtro de etiquetas',
        category: 'Filtro de etiquetas do WhatsApp',
        actual_behavior: 'etiquetas sendo marcadas erradas marcando etiqueta mamografia SISREG',
        expected_behavior: 'deveria ser Tomografia Tórax',
        severity: 'Média',
        status: 'Reportado',
      },
    ]

    reports.forEach((data) => {
      try {
        app.findFirstRecordByData('reports', 'actual_behavior', data.actual_behavior)
        return // exists
      } catch (_) {}

      const record = new Record(reportsCol)
      record.set('title', data.title)
      record.set('category', data.category)
      record.set('actual_behavior', data.actual_behavior)
      record.set('expected_behavior', data.expected_behavior)
      record.set('severity', data.severity)
      record.set('status', data.status)
      record.set('user_id', adminId)
      app.save(record)
    })
  },
  (app) => {
    const behaviors = [
      'após 10 minutos sem a resposta do paciente vem a pergunta se o paciente ainda está ali.',
      'se o paciente enviar uma mensagem sem contexto a IA acaba inventando algo.',
      'ao finalizar uma conversa e eventualmente o mesmo paciente venha conversar novamente ele acaba caindo para a ultima atendente.',
      'e marcou mamografia SISREG',
      'etiquetas sendo marcadas erradas marcando etiqueta mamografia SISREG',
    ]

    behaviors.forEach((behavior) => {
      try {
        const record = app.findFirstRecordByData('reports', 'actual_behavior', behavior)
        app.delete(record)
      } catch (_) {}
    })
  },
)
