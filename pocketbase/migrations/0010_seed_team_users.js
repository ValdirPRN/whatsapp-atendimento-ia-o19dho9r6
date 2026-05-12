migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    const seedUsers = [
      { username: 'paulo_novack', name: 'Paulo novack', password: 'Skip@2026' },
      { username: 'joane', name: 'Joane', password: 'Skip@2026' },
      { username: 'admin', name: 'admin', password: 'Skip@2026' },
    ]

    for (const u of seedUsers) {
      try {
        app.findFirstRecordByData('_pb_users_auth_', 'username', u.username)
      } catch (_) {
        const record = new Record(usersCol)
        record.set('username', u.username)
        record.setPassword(u.password)
        record.set('name', u.name)
        record.setEmail(u.username + '@prn.med')
        record.setVerified(true)

        app.saveNoValidate(record)
      }
    }
  },
  (app) => {
    const usernames = ['paulo_novack', 'joane', 'admin']
    for (const un of usernames) {
      try {
        const record = app.findFirstRecordByData('_pb_users_auth_', 'username', un)
        app.delete(record)
      } catch (_) {}
    }
  },
)
