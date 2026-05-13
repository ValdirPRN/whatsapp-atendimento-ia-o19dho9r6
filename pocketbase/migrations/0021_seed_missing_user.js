migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'joany@agentpro.local')
      return // already seeded
    } catch (_) {}

    try {
      app.findFirstRecordByData('_pb_users_auth_', 'username', 'joany')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.set('username', 'joany')
    record.setEmail('joany@agentpro.local')
    record.setPassword('Prn@2026')
    record.setVerified(true)
    record.set('name', 'Joany')
    record.set('role', 'user')

    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'joany@agentpro.local')
      app.delete(record)
    } catch (_) {}
  },
)
