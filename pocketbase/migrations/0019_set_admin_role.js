migrate(
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('users', 'samuelklausfischer@hotmail.com')
      record.set('role', 'admin')
      app.save(record)
    } catch (_) {}
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('users', 'samuelklausfischer@hotmail.com')
      record.set('role', '')
      app.save(record)
    } catch (_) {}
  },
)
