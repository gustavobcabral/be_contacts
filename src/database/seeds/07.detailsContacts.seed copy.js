const data = require('./detailsContacts.json')
const table = 'details_contacts'

exports.seed = function(knex) {
  return knex(table)
    .del()
    .then(function() {
      return knex(table).insert(data)
    })
}
