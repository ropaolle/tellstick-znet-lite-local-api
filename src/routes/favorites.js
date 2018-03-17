'use strict'

module.exports = {
  method: 'GET',
  path: '/api/v1/favorites',
  handler: async (request, h) => {
    const db = request.db()
    const favorites = db.get('app.favorites').value()

    const set = new Set(favorites)
    const id = Number(request.query.id)

    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }

    db.set('app.favorites', [...set]).write()

    return h.response({ success: true, favorites: [ ...set ] })
  }
}
