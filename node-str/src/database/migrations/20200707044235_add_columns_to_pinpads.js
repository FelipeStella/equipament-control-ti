exports.up = knex => knex.schema.alterTable('pinpads', table => {
  table.text('status')
  table.text('branch')
  table.text('cashier')
  table.text('protocol')
  table.text('situation')
});

exports.down = knex => knex.schema.alterTable('pinpads', table => {
  table.dropColumn('status')
  table.dropColumn('branch')
  table.dropColumn('cashier')
  table.dropColumn('protocol')
  table.dropColumn('situation')
});