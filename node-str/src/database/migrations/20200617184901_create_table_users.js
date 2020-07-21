const { onUpdateTrigger } = require('../../config/knexfile');

exports.up = async knex => knex.schema.createTable('users', table => {
    table.increments('id')
    table.integer('company_registration').unique().notNullable()
    table.text('username').unique().notNullable()
    table.string('password_hash')

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  }).then(() => knex.raw(onUpdateTrigger('users')));

exports.down = async knex => knex.schema.dropTable('users');
