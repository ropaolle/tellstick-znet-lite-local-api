'use strict'

module.exports = {
  method: 'GET',
  path: '/api/v1/favorites/{id}',
  handler: async (request, h) => {
    const db = request.db()
    const favorites = db.get('app.favorites').value()

    const id = Number(request.params.id)
    const set = new Set(favorites)
    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }

    db.set('app.favorites', [...set]).write()

    return h.response({ success: true, favorites })
  }
}
