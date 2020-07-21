const { onUpdateTrigger } = require('../../config/knexfile');

exports.up = async knex => knex.schema.createTable('pinpads', table => {
  table.increments('id')
  table.text('model').notNullable()
  table.text('serial_pinpad').unique().notNullable()
  table.text('serial_cielo').unique().notNullable()
  table.text('cable_length').notNullable()

  //relacionamento
  table.integer('user_id')
    .references('users.id')
    .notNullable()

  table.timestamps(true, true)
}).then(() => knex.raw(onUpdateTrigger('pinpads')));

exports.down = async knex => knex.schema.dropTable('pinpads');