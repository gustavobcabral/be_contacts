const data = require('./permissions.json')
const table = 'permissions'

exports.seed = function(knex) {
  return knex(table)
    .del()
    .then(function() {
      return knex(table).insert(data)
    })
}
