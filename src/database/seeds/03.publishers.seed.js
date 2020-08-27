const crypto = require('crypto')
const table = 'publishers'

exports.seed = function(knex) {
  const data = [
    {
      name: 'Admin',
      password: crypto.createHmac('sha256', '123456').digest('hex'),
      email: 'admin@example.com',
      active: true
    }
  ]
  return knex(table)
    .del()
    .then(function() {
      return knex(table).insert(data)
    })
}
