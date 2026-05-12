migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    // Update password field constraints to allow the 'admin' (5 chars) password
    try {
      const passField = usersCol.fields.getByName('password')
      if (passField && passField.min > 5) {
        passField.min = 5
        app.save(usersCol)
      }
    } catch (e) {
      console.log('Could not update password min length', e)
    }

    const toSeed = [
      { email: 'paulo.novack@medimagem.com.br', pass: 'Prn2026', name: 'Paulo Novack' },
      { email: 'joane@medimagem.com.br', pass: 'Prn2026', name: 'Joane' },
      { email: 'admin@medimagem.com.br', pass: 'admin', name: 'admin' },
    ]

    for (const u of toSeed) {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', u.email)
      } catch (_) {
        try {
          const record = new Record(usersCol)
          record.setEmail(u.email)
          record.setPassword(u.pass)
          record.setVerified(true)
          record.set('name', u.name)
          app.save(record)
        } catch (saveErr) {
          console.log('Error saving user:', u.email, saveErr)
        }
      }
    }
  },
  (app) => {
    const toSeed = [
      'paulo.novack@medimagem.com.br',
      'joane@medimagem.com.br',
      'admin@medimagem.com.br',
    ]
    for (const email of toSeed) {
      try {
        const record = app.findAuthRecordByEmail('_pb_users_auth_', email)
        app.delete(record)
      } catch (_) {}
    }
  },
)
