import { encrypt } from '../../helpers/genericHelpers'

const table = 'publishers'

exports.seed = function(knex) {
  const data = [
    {
      name: 'Admin',
      password: encrypt('123456'),
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
