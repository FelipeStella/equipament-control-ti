
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('pinpads').del()
    .then(function () {
      // Inserts seed entries
      return knex('pinpads').insert([
        { 
          model: 'IPP320-01T1826B',
          serial_pinpad: '16120PP30739984',
          serial_cielo: '60404550719402',
          cable_length: '3 metros',
          user_id: 2
        }

      ]);
    });
};
