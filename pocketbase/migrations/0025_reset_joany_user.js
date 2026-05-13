migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Checks for any existing user with the username 'joany' and deletes them
    try {
      const existingByUsername = app.findFirstRecordByData('_pb_users_auth_', 'username', 'joany')
      app.delete(existingByUsername)
    } catch (_) {}

    // Checks for any existing user with the related email and deletes them
    try {
      const existingByEmail = app.findAuthRecordByEmail('_pb_users_auth_', 'joany@example.com')
      app.delete(existingByEmail)
    } catch (_) {}

    // Creates a new clean user record for joany
    const record = new Record(users)
    record.set('username', 'joany')
    record.setEmail('joany@example.com')
    record.setPassword('Prn@2026')
    record.setVerified(true)
    record.set('role', 'user')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'joany@example.com')
      app.delete(record)
    } catch (_) {}
    try {
      const record = app.findFirstRecordByData('_pb_users_auth_', 'username', 'joany')
      app.delete(record)
    } catch (_) {}
  },
)
