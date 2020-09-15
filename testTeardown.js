const knex = require('./src/database/connection')

module.exports = async () => {
  await knex.destroy()
}
