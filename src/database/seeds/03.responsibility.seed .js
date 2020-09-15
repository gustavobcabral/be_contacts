const data = require('./responsibility.json')
const table = 'responsibility'

exports.seed = function(knex) {
  return knex(table)
    .del()
    .insert(data)
}
