
exports.up = knex => knex.schema.alterTable('pinpads', table => {
  table.dropColumn('branch');
  table.dropColumn('cashier');
});

exports.down = knex => knex.schema.alterTable('pinpads', table => {
  table.text('branch');
  table.text('cashier');
});
