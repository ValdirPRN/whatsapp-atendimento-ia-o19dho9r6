migrate(
  (app) => {
    const collection = new Collection({
      name: 'reports',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'title', type: 'text' },
        { name: 'context', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'actual_behavior', type: 'text', required: true },
        { name: 'expected_behavior', type: 'text', required: true },
        { name: 'technical_notes', type: 'text' },
        { name: 'severity', type: 'text' },
        { name: 'status', type: 'text' },
        {
          name: 'images',
          type: 'file',
          maxSelect: 5,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('reports')
    app.delete(collection)
  },
)
