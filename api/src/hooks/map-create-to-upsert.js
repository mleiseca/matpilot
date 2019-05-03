
// Taken from https://github.com/feathers-plus/feathers-hooks-common/issues/99
// Taken from https://gist.github.com/marshallswain/d800a56479546912370f4e24f21c7f67

module.exports = function(upsertQuery) {
  if (typeof upsertQuery !== 'function') {
    throw new Error('No `upsertQuery` function was passed to the mapCreateToUpsert hook.')
  }

  return function upsert(context) {
    const {service, data, params} = context

    const query = upsertQuery(context)

    return service.find({query})
      .then(page => {
        if (page.total === 0) {
          return Promise.resolve(context)
        } else {
          const itemToUpdate = page.data[0]
          return service
            .patch(itemToUpdate.id, data, params)
            .then(result => {
              context.result = result
            })
        }
      })
  }
}

