migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    const passwordField = col.fields.getByName('password')
    if (passwordField) {
      passwordField.min = 5
      app.save(col)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('_pb_users_auth_')
    const passwordField = col.fields.getByName('password')
    if (passwordField) {
      passwordField.min = 8
      app.save(col)
    }
  },
)
