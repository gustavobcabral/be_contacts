const data = require('./contacts.json')
const table = 'contacts'

exports.seed = function(knex) {
  return knex(table)
    .del()
    .then(function() {
      return knex(table).insert(data)
    })
}
