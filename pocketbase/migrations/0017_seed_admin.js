migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'samuelklausfischer@hotmail.com')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('samuelklausfischer@hotmail.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Admin')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'samuelklausfischer@hotmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
