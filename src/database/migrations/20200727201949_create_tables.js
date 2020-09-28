exports.up = function(knex) {
  return knex.schema
    .createTable('responsibility', function(table) {
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

    .createTable('publishers', function(table) {
      table.increments()
      table.string('name').notNullable()
      table.string('password').nullable()
      table.string('hash').nullable()
      table
        .string('email')
        .nullable()
        .unique()
      table.integer('idResponsibility').defaultTo(1)
      table
        .boolean('active')
        .notNullable()
        .defaultTo(true)
      table
        .boolean('haveToReauthenticate')
        .notNullable()
        .defaultTo(false)
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()

      table
        .foreign('createdBy')
        .references('id')
        .inTable('publishers')
      table
        .foreign('updatedBy')
        .references('id')
        .inTable('publishers')

      table
        .foreign('idResponsibility')
        .references('id')
        .inTable('responsibility')
    })

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
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()

      table
        .foreign('createdBy')
        .references('id')
        .inTable('publishers')
      table
        .foreign('updatedBy')
        .references('id')
        .inTable('publishers')
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
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()

      table
        .foreign('createdBy')
        .references('id')
        .inTable('publishers')
      table
        .foreign('updatedBy')
        .references('id')
        .inTable('publishers')
    })

    .createTable('contacts', function(table) {
      table
        .string('phone')
        .notNullable()
        .primary()
      table.string('name')
      table.integer('idStatus').notNullable()
      table.integer('idLanguage')
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()

      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())
      table
        .foreign('createdBy')
        .references('id')
        .inTable('publishers')
      table
        .foreign('updatedBy')
        .references('id')
        .inTable('publishers')

      table
        .foreign('idLanguage')
        .references('id')
        .inTable('languages')
      table
        .foreign('idStatus')
        .references('id')
        .inTable('status')
    })
    .createTable('detailsContacts', function(table) {
      table.increments()
      table.text('information').notNullable()
      table.integer('idPublisher').notNullable()
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()
      table.string('phoneContact').notNullable()
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())

      table
        .foreign('createdBy')
        .references('id')
        .inTable('publishers')
      table
        .foreign('updatedBy')
        .references('id')
        .inTable('publishers')
      table
        .foreign('idPublisher')
        .references('id')
        .inTable('publishers')

      table
        .foreign('phoneContact')
        .references('phone')
        .inTable('contacts')
    })

    .createTable('permissions', function(table) {
      table.increments()
      table.string('method').notNullable()
      table.string('page').notNullable()
      table.integer('idMinimumResponsibilityRequired').notNullable()
      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now())
      table.integer('createdBy').notNullable()
      table.integer('updatedBy').nullable()

      table
        .foreign('createdBy')
        .references('id')
        .inTable('publishers')
      table
        .foreign('updatedBy')
        .references('id')
        .inTable('publishers')

      table
        .foreign('idMinimumResponsibilityRequired')
        .references('id')
        .inTable('responsibility')
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('detailsContacts')
    .dropTable('contacts')
    .dropTable('status')
    .dropTable('languages')
    .dropTable('permissions')
    .dropTable('publishers')
    .dropTable('responsibility')
}
