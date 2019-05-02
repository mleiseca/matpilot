// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// Taken from https://gist.github.com/marshallswain/d800a56479546912370f4e24f21c7f67
const logger = require('winston')

module.exports = function(upsertQuery) {
  if (typeof upsertQuery !== 'function') {
    logger.warn(
      'No `upsertQuery` function was passed to the mapCreateToUpsert hook. Please set params.upsertQuery in the hook context to dynamically declare the function.'
    )
  }

  return function upsert(context) {
    const { service, data, params } = context

    upsertQuery = params.upsertQuery || upsertQuery
    if (typeof upsertQuery !== 'function') {
      throw new Error(
        'You must pass a `upsertQuery` function to the mapCreateToUpsert hook in the options or as `params.upsertQuery` in the hook context'
      )
    }

    params.postgres = Object.assign({}, params.postgres, { upsert: true })

    try {
      params.query = upsertQuery(context)
    } catch (error) {
      context.error = error
      return context
    }

    return service
      .patch(null, data, params)
      .then(result => {
        delete context.error
        context.result = result
      })
      .catch(error => {
        context.error = error
      })
      .then(() => context)
  }
}
