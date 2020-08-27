exports.up = function(knex) {
  return knex.schema
    .createTable('status', function(table) {
      table.increments()
      table
        .string('description')
        .notNullable()
        .unique()
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())
    })
    .createTable('languages', function(table) {
      table.increments()
      table
        .string('name')
        .notNullable()
        .unique()
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())
    })
    .createTable('contacts', function(table) {
      table
        .string('phone')
        .notNullable()
        .primary()
      table.string('name')
      table.integer('id_status').notNullable()
      table.integer('id_language')
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())

      table
        .foreign('id_language')
        .references('id')
        .inTable('languages')
      table
        .foreign('id_status')
        .references('id')
        .inTable('status')
    })
    .createTable('publishers', function(table) {
      table.increments()
      table.string('name').notNullable()
      table.string('password').nullable()
      table
        .string('email')
        .nullable()
        .unique()
      table
        .boolean('active')
        .notNullable()
        .defaultTo(true)
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())
    })
    .createTable('details_contacts', function(table) {
      table.increments()
      table.text('information').notNullable()
      table.integer('id_publisher').notNullable()
      table.string('phone_contact').notNullable()
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())

      table
        .foreign('id_publisher')
        .references('id')
        .inTable('publishers')

      table
        .foreign('phone_contact')
        .references('phone')
        .inTable('contacts')
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('details_contacts')
    .dropTable('contacts')
    .dropTable('publishers')
    .dropTable('status')
    .dropTable('languages')
}
