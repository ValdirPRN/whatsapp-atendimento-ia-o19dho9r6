migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'dev@agentpro.com')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('dev@agentpro.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Developer')
    record.set('role', 'dev')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'dev@agentpro.com')
      app.delete(record)
    } catch (_) {}
  },
)
