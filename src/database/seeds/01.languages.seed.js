const data = require('./languages')
const table = 'languages'

exports.seed = function(knex) {
  return knex(table)
    .del()
    .then(function() {
      return knex(table).insert(data)
    })
}
