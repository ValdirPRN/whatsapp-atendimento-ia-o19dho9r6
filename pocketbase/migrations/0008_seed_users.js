migrate(
  (app) => {
    let users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Lower minimum password length to 5 to allow 'admin' password
    const pwd = users.fields.getByName('password')
    if (pwd && pwd.min !== 5) {
      pwd.min = 5
      app.save(users)
      // Reload collection instance
      users = app.findCollectionByNameOrId('_pb_users_auth_')
    }

    const seedUser = (email, username, name, password) => {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', email)
        return // already exists
      } catch (_) {}

      try {
        const user = new Record(users)
        user.setEmail(email)
        user.set('username', username)
        user.setPassword(password)
        user.setVerified(true)
        user.set('name', name)
        app.save(user)
      } catch (e) {
        console.log('Failed to seed user ' + username + ': ' + e)
      }
    }

    seedUser('samuelklausfischer@hotmail.com', 'samuelklausfischer', 'Samuel', 'Skip@Pass')
    seedUser('paulo@medimagem.com', 'paulonovack', 'Paulo novack', 'Prn2026')
    seedUser('joane@medimagem.com', 'joane', 'Joane', 'Prn2026')
    seedUser('admin@medimagem.com', 'admin', 'admin', 'admin')
  },
  (app) => {},
)
