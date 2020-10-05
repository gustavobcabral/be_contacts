const data = require('./detailsContacts.json')
const table = 'detailsContacts'

exports.seed = function(knex) {
  return knex(table)
    .del()
    .then(function() {
      return knex(table).insert(data)
    })
}
