migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Cleanup by email to avoid unique constraint error
    try {
      const byEmail = app.findAuthRecordByEmail('_pb_users_auth_', 'joany@example.com')
      app.delete(byEmail)
    } catch (_) {
      // ignore if not found
    }

    // Cleanup by username to avoid unique constraint error
    try {
      const byUsername = app.findFirstRecordByData('_pb_users_auth_', 'username', 'joany')
      app.delete(byUsername)
    } catch (_) {
      // ignore if not found
    }

    // Create clean user with exact credentials
    const record = new Record(users)
    record.set('username', 'joany')
    record.setEmail('joany@example.com')
    record.setPassword('Prn@2026')
    record.setVerified(true)
    record.set('name', 'Joany')
    record.set('role', 'admin')

    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'joany@example.com')
      app.delete(record)
    } catch (_) {
      // ignore if not found
    }
  },
)
