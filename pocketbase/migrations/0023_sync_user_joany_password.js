migrate(
  (app) => {
    let user

    // Try to find the user by username "joany"
    try {
      user = app.findFirstRecordByData('users', 'username', 'joany')
    } catch (_) {}

    // If not found by username, try finding by email containing "joany"
    if (!user) {
      try {
        const records = app.findRecordsByFilter('users', "email ~ 'joany'", '-created', 1, 0)
        if (records && records.length > 0) {
          user = records[0]
        }
      } catch (_) {}
    }

    // Idempotent Upsert
    if (user) {
      // If the user exists, update their password
      user.setPassword('Prn@2026')
      app.save(user)
    } else {
      // If the user does not exist, insert a new record
      const col = app.findCollectionByNameOrId('users')
      const record = new Record(col)

      record.set('username', 'joany')
      record.setEmail('joany@agentpro.local')
      record.setPassword('Prn@2026')
      record.setVerified(true)
      record.set('name', 'Joany')

      app.save(record)
    }
  },
  (app) => {
    // Down migration not applicable
  },
)
