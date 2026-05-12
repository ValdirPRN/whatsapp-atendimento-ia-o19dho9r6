migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('reports')
    app.truncateCollection(col)
  },
  (app) => {
    // No-op
  },
)
