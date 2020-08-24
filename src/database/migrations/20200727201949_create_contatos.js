exports.up = function (knex) {
  return knex.schema
    .createTable("status", function (table) {
      table.increments();
      table.text("description").notNullable();
    })
    .createTable("language", function (table) {
      table.increments();
      table.string("name").notNullable();
    })
    .createTable("contacts", function (table) {
      table.string("phone").notNullable().primary();
      table.string("name");
      table.integer("id_status").notNullable();
      table.integer("id_language");
      table.foreign("id_language").references("id").inTable("language");
      table.foreign("id_status").references("id").inTable("status");
    })
    .createTable("publishers", function (table) {
      table.increments();
      table.string("name");
      table.boolean("active").notNullable();
    })
    .createTable("details_contacts", function (table) {
      table.increments();
      table.date("date").notNullable();
      table.text("information").notNullable();
      table.integer("id_publisher").notNullable();
      table.foreign("id_publisher").references("id").inTable("publishers");

      //relacionamento para mostrar qual vendedor criou o produto
      //chave estrangeira verifica se o id é um id que esta cadastrado na tabela de vendedores
      table.string("phone_contact").notNullable();
      table.foreign("phone_contact").references("phone").inTable("contacts");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("details_contacts")
    .dropTable("publishers")
    .dropTable("contacts")
    .dropTable("status")
    .dropTable("language");
};

// Criar tabela STATUS com os campos ID e DESCRICAO
