migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let record

    try {
      record = app.findFirstRecordByData('_pb_users_auth_', 'username', 'joany')
    } catch (_) {
      try {
        record = app.findAuthRecordByEmail('_pb_users_auth_', 'joany@agentpro.local')
      } catch (_) {
        record = new Record(users)
        record.set('username', 'joany')
        record.setEmail('joany@agentpro.local')
        record.set('name', 'Joany')
      }
    }

    record.setPassword('Prn@2026')
    record.setVerified(true)

    app.save(record)
  },
  (app) => {
    // Empty down migration to prevent accidental deletion of a production user
  },
)
