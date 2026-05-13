migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    let record
    try {
      record = app.findFirstRecordByData('_pb_users_auth_', 'username', 'joany')
    } catch (_) {
      try {
        record = app.findFirstRecordByData('_pb_users_auth_', 'email', 'joany@example.com')
      } catch (_) {
        // Record not found
      }
    }

    if (record) {
      record.set('username', 'joany')
      record.setPassword('Prn@2026')
      app.save(record)
    } else {
      const newRecord = new Record(users)
      newRecord.set('username', 'joany')
      newRecord.setEmail('joany@example.com')
      newRecord.setPassword('Prn@2026')
      newRecord.setVerified(true)
      newRecord.set('name', 'Joany')
      app.save(newRecord)
    }
  },
  (app) => {
    // Down migration
  },
)
