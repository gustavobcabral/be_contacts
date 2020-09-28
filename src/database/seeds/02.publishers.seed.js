const crypto = require('crypto')
const table = 'publishers'

exports.seed = function(knex) {
  const data = [
    {
      name: 'Admin',
      password: crypto.createHmac('sha256', '123456').digest('hex'),
      email: 'admin@example.com',
      idResponsibility: 4,
      createdBy: 1,
      active: true,
      createdAt: '2020-08-31T13:59:35.232Z'
    }
  ]
  return knex(table)
    .del()
    .then(function() {
      return knex(table).insert(data)
    })
}
