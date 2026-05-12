migrate(
  (app) => {
    // 1. Ensure global access for authenticated users
    const reportsCol = app.findCollectionByNameOrId('reports')
    reportsCol.listRule = "@request.auth.id != ''"
    reportsCol.viewRule = "@request.auth.id != ''"
    reportsCol.createRule = "@request.auth.id != ''"
    reportsCol.updateRule = "@request.auth.id != ''"
    reportsCol.deleteRule = "@request.auth.id != ''"
    app.save(reportsCol)

    // 2. Resolve an author for the restored reports
    let authorId = ''
    try {
      const admin = app.findAuthRecordByEmail('_pb_users_auth_', 'admin@medimagem.com')
      authorId = admin.id
    } catch (_) {
      try {
        const fallback = app.findAuthRecordByEmail(
          '_pb_users_auth_',
          'samuelklausfischer@hotmail.com',
        )
        authorId = fallback.id
      } catch (_) {}
    }

    // 3. Seed specific records
    const seedReport = (
      id,
      title,
      context,
      actual,
      expected,
      category,
      severity,
      status,
      createdDate,
    ) => {
      try {
        app.findRecordById('reports', id)
        return // already restored
      } catch (_) {}

      const record = new Record(reportsCol)
      record.set('id', id)
      record.set('title', title)
      record.set('context', context)
      record.set('actual_behavior', actual)
      record.set('expected_behavior', expected)
      record.set('category', category)
      record.set('severity', severity)
      record.set('status', status)
      if (authorId) {
        record.set('user_id', authorId)
      }
      app.save(record)

      // Force the exact created date
      app
        .db()
        .newQuery('UPDATE reports SET created = {:date} WHERE id = {:id}')
        .bind({ date: createdDate + ' 10:00:00.000Z', id: id })
        .execute()
    }

    seedReport(
      'hclbso6xarmp0qo',
      'Mensagem de 10min',
      'após 10 minutos sem a resposta do paciente vem a pergunta se o paciente ainda está ali.',
      'após 10 minutos sem a resposta do paciente vem a pergunta se o paciente ainda está ali.',
      'essa mensagem deve ser enviada em um tempo maior para evitar de ter spam na conversa. Tempo sugerido: 30min a 1 hora.',
      'Triagem da conversa',
      'Média',
      'Reportado',
      '2026-05-12',
    )

    seedReport(
      'd2ry42evbr275mu',
      'Mensagem sem contexto',
      'se o paciente enviar uma mensagem sem contexto a IA acaba inventando algo.',
      'se o paciente enviar uma mensagem sem contexto a IA acaba inventando algo.',
      'se a mensagem nao possui contexto a IA deve fazer perguntas ou pedir para o paciente esclarecer.',
      'Triagem da conversa',
      'Média',
      'Reportado',
      '2026-05-12',
    )

    seedReport(
      '7c99zy6ukuga8r1',
      'Conversa concluída',
      'um erro grave. se caso aquele atendente não estiver online no momento, essa ira ficar sem resposta.',
      'ao finalizar uma conversa e eventualmente o mesmo paciente venha conversar novamente ele acaba caindo para a ultima atendente.',
      "ao finalizar a conversa e o mesmo paciente vier mandar mensagem novamente, devera cair em 'geral' para qualquer atendente poder atender essa paciente.",
      'Triagem da conversa',
      'Alta',
      'Reportado',
      '2026-05-12',
    )

    seedReport(
      'izlec3s8bpn1rl4',
      'Filtro de etiquetas',
      'e marcou mamografia SISREG',
      'e marcou mamografia SISREG',
      'ultrassom obstétrica com Doppler',
      'Filtro de etiquetas do WhatsApp',
      'Média',
      'Reportado',
      '2026-05-12',
    )

    seedReport(
      '0n452zrn4kadmwa',
      'Filtro de etiquetas',
      'etiquetas sendo marcadas erradas',
      'marcando etiqueta mamografia SISREG',
      'deveria ser Tomografia Tórax',
      'Filtro de etiquetas do WhatsApp',
      'Média',
      'Reportado',
      '2026-05-12',
    )
  },
  (app) => {},
)
