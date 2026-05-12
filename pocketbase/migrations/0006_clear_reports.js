migrate(
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('reports')
      app.truncateCollection(col)
    } catch (e) {
      console.log('Failed to clear reports:', e)
    }
  },
  (app) => {
    // Truncation cannot be reverted
  },
)
