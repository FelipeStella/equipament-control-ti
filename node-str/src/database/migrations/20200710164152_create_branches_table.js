const { onUpdateTrigger } = require('../../../knexfile');

exports.up = async knex => knex.schema.createTable('branches', table => {
  table.increments('id')
  table.text('affiliate').notNullable()
  table.text('name').notNullable()
  table.text('cashier').notNullable()

  //relacionamento
  table.integer('pinpad_id')
    .references('pinpads.id')

  table.timestamps(true, true)
}).then(() => knex.raw(onUpdateTrigger('branches')));

exports.down = async knex => knex.schema.dropTable('branches');
