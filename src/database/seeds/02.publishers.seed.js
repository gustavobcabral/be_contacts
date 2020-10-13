const crypto = require('crypto')
const table = 'publishers'

exports.seed = async function(knex) {
  const data = [
    {
      name: 'Admin',
      phone: '0983222111',
      password: crypto.createHmac('sha256', '123456').digest('hex'),
      email: 'admin@example.com',
      idResponsibility: 4,
      createdBy: 1,
      active: true,
      createdAt: '2020-08-31T13:59:35.232Z'
    }
  ]
  await knex(table).del()
  await knex.raw(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1`)
  return knex(table).insert(data)
}
