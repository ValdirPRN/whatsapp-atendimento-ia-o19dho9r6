migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    const seedUser = (username, email, name, password) => {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', email)
        return // exists
      } catch (_) {}

      try {
        const record = app.findFirstRecordByData('_pb_users_auth_', 'username', username)
        if (record) return // username taken
      } catch (_) {}

      const record = new Record(users)
      record.set('username', username)
      record.setEmail(email)
      record.setPassword(password)
      record.setVerified(true)
      record.set('name', name)
      app.save(record)
    }

    seedUser('paulo_novack', 'paulo@example.com', 'Paulo novack', 'Prn2026')
    seedUser('joane', 'joane@example.com', 'Joane', 'Prn2026')
    seedUser('admin', 'admin@example.com', 'Admin', 'admin')
    seedUser('samuel', 'samuelklausfischer@hotmail.com', 'Samuel Fischer', 'Skip@Pass')
  },
  (app) => {
    const emails = [
      'paulo@example.com',
      'joane@example.com',
      'admin@example.com',
      'samuelklausfischer@hotmail.com',
    ]
    emails.forEach((email) => {
      try {
        const record = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(record)
      } catch (_) {}
    })
  },
)
