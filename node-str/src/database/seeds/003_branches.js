
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('branches').del()
    .then(function () {
      // Inserts seed entries
      return knex('branches').insert([
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 01'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 02'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 03'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 04'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 05'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 06'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 07'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 08'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 09'
        },
        {
          affiliate: 1,
          name: 'Filial 01',
          cashier: 'PDV 10'
        }

      ]);
    });
};
