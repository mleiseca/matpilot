

function customQuery(options) {
  const queryMap = options.queries
  const model = options.model
  // TODO add restrictAccessForGym({ role: ['OWNER', 'ADMIN'] }?
  return function (hook) {
    const { $customQuery: queryName } = hook.params.query

    if (!queryName) {
      // console.log('NO custom query')
      Promise.resolve(hook)
      return
    }
    delete hook.params.query['$customQuery']
    console.log('running custom query....', queryName.type)
    const sequelize = hook.app.get('sequelizeClient')

    const queryOptions = {}
    if (model) {
      queryOptions.model = sequelize.models[model]
    }

    if (queryName.bind) {
      queryOptions.bind = queryName.bind
    }

    if (queryName.replacements) {
      queryOptions.replacements = queryName.replacements
    }

    const query = queryMap[queryName.type]
    console.log('queryOptions', queryOptions)
    console.log('query', query, queryName)

    return sequelize.query(query, queryOptions).then(results => {
      hook.result = results // this tells feathers to skip the DATA STORE step above
      return hook // always resolve the promise chain with the context
    })
  }

}


module.exports = {
  customQuery
}
