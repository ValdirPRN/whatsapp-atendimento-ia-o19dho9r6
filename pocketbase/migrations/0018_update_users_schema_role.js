migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    if (!col.fields.getByName('role')) {
      col.fields.add(new TextField({ name: 'role' }))
    }
    col.deleteRule = "@request.auth.role = 'admin' || id = @request.auth.id"
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    col.fields.removeByName('role')
    col.deleteRule = 'id = @request.auth.id'
    app.save(col)
  },
)
