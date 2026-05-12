migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    // Ajusta o comprimento mínimo da senha para permitir "admin" (5 caracteres)
    const passwordField = usersCol.fields.getByName('password')
    if (passwordField && passwordField.min > 5) {
      passwordField.min = 5
      app.save(usersCol)
    }

    const ensureUser = (email, username, name, password) => {
      try {
        return app.findAuthRecordByEmail('_pb_users_auth_', email)
      } catch (_) {
        const record = new Record(usersCol)
        record.setEmail(email)
        record.set('username', username)
        record.setPassword(password)
        record.setVerified(true)
        record.set('name', name)
        app.save(record)
        return record
      }
    }

    const admin = ensureUser('admin@prn.com', 'admin', 'admin', 'admin')
    ensureUser('paulo@prn.com', 'paulo', 'Paulo Novack', 'Prn2026')
    ensureUser('joane@prn.com', 'joane', 'Joane', 'Prn2026')

    const reportsCol = app.findCollectionByNameOrId('reports')

    const reports = [
      {
        id: 'hclbso6xarmp0qo',
        title: 'Mensagem de 10min',
        actual_behavior:
          'após 10 minutos sem a resposta do paciente vem a pergunta se o paciente ainda está ali.',
        expected_behavior:
          'essa mensagem deve ser enviada em um tempo maior para evitar de ter spam na conversa. Tempo sugerido: 30min a 1 hora.',
        category: 'Triagem da conversa',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        id: 'd2ry42evbr275mu',
        title: 'Mensagem sem contexto',
        actual_behavior:
          'se o paciente enviar uma mensagem sem contexto a IA acaba inventando algo.',
        expected_behavior:
          'se a mensagem nao possui contexto a IA deve fazer perguntas ou pedir para o paciente esclarecer.',
        category: 'Triagem da conversa',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        id: '7c99zy6ukuga8r1',
        title: 'Conversa concluída',
        actual_behavior:
          'ao finalizar uma conversa e eventualmente o mesmo paciente venha conversar novamente ele acaba caindo para a ultima atendente.',
        expected_behavior:
          'ao finalizar a conversa e o mesmo paciente vier mandar mensagem novamente, devera cair em "geral" para qualquer atendente poder atender essa paciente.',
        category: 'Triagem da conversa',
        severity: 'Alta',
        status: 'Reportado',
      },
      {
        id: 'izlec3s8bpn1rl4',
        title: 'Filtro de etiquetas',
        actual_behavior: 'e marcou mamografia SISREG',
        expected_behavior: 'ultrassom obstétrica com Doppler',
        category: 'Filtro de etiquetas do WhatsApp',
        severity: 'Média',
        status: 'Reportado',
      },
      {
        id: '0n452zrn4kadmwa',
        title: 'Filtro de etiquetas',
        actual_behavior: 'marcando etiqueta mamografia SISREG',
        expected_behavior: 'deveria ser Tomografia Tórax',
        category: 'Filtro de etiquetas do WhatsApp',
        severity: 'Média',
        status: 'Reportado',
      },
    ]

    for (const data of reports) {
      try {
        app.findRecordById('reports', data.id)
      } catch (_) {
        const r = new Record(reportsCol)
        r.set('id', data.id)
        r.set('title', data.title)
        r.set('actual_behavior', data.actual_behavior)
        r.set('expected_behavior', data.expected_behavior)
        r.set('category', data.category)
        r.set('severity', data.severity)
        r.set('status', data.status)
        r.set('user_id', admin.id)
        app.save(r)

        // Define as datas exatas usando raw SQL (12/05/2026)
        app
          .db()
          .newQuery(
            "UPDATE reports SET created = '2026-05-12 12:00:00.000Z', updated = '2026-05-12 12:00:00.000Z' WHERE id = {:id}",
          )
          .bind({ id: data.id })
          .execute()
      }
    }
  },
  (app) => {
    const reportIds = [
      'hclbso6xarmp0qo',
      'd2ry42evbr275mu',
      '7c99zy6ukuga8r1',
      'izlec3s8bpn1rl4',
      '0n452zrn4kadmwa',
    ]
    for (const id of reportIds) {
      try {
        const r = app.findRecordById('reports', id)
        app.delete(r)
      } catch (_) {}
    }

    const emails = ['admin@prn.com', 'paulo@prn.com', 'joane@prn.com']
    for (const email of emails) {
      try {
        const u = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(u)
      } catch (_) {}
    }
  },
)
