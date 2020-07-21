'use strict';

const yup = require('yup');

const knex = require('../../database')

module.exports = {
  async findPinpads(req, res, next) {
    try{
      const { user_id, page = 1 } = req.query;

      const query = knex('pinpads')
      .join( 'users', 'users.id', '=', 'pinpads.user_id')
      .select( 'pinpads.*', 'users.username')
      .limit(5)
      .offset((page - 1) * 5)

      const countPinpads = knex('pinpads').count()

      if(user_id) {
        query
        .where({ user_id })
        .join( 'users', 'users.id', '=', 'pinpads.user_id')
        .select( 'pinpads.*', 'users.username')

        countPinpads
        .where({ user_id })
      }

      const [count] = await countPinpads
      res.header('X-Total-Count', count['count'])

      const results = await query
      return res.json(results)

    }catch (error) {
      next(error)
    }
      
  },
  async createPinpad(req, res, next) {
    try {
      const schema = yup.object().shape({
        model: yup.string().required(),
        serial_pinpad: yup.string().required(),
        serial_cielo: yup.string().required(),
        cable_length: yup.string().required(),
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' })
      }

      const user_id = req.userId

      const { model, serial_pinpad, serial_cielo, cable_length } = req.body

      //Validação do campo "serial_pinpad"
      const querySerial_pinpad = await knex('pinpads')
        .select('id','serial_pinpad')
        .where({ serial_pinpad })       

      if(querySerial_pinpad != ""){
          return res.status(401).json({ error: 'This PinPad serial number is already registered!'})
      }
      //Fim

      //Validação do campo "serial_cielo"
      const querySerial_cielo = await knex('pinpads')
        .select('id','serial_cielo')
        .where({ serial_cielo })       

      if(querySerial_cielo != ""){
          return res.status(401).json({ error: 'This Cielo serial number is already registered!'})
      }
      //Fim
        
        await knex('pinpads').insert({
          model, 
          serial_pinpad, 
          serial_cielo,
          cable_length,
          user_id
        }) 

        const status = "instaled";
        const situacion = "active";

        await knex('pinpads')
        .update({ status, situacion }) 
        .where({ id })
        
        return res.json({
          model, 
          serial_pinpad, 
          serial_cielo,
          cable_length,
          user_id
        })
      
    } catch (error) {
      next(error)
    }
    
  },
  async updatePinpad(req, res, next) {
    try {
      const schema = yup.object().shape({
        model: yup.string(),
        serial_pinpad: yup.string(),
        serial_cielo: yup.string(),
        cable_length: yup.string(),
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' })
      }

      const { id } = req.params
      const user_id = req.userId
      const { model, serial_pinpad, serial_cielo, cable_length } = req.body

      //Validação do campo id passado nos parâmetros
      const queryIdPinpad = await knex('pinpads')
        .select('id')
        .where({ id })       

      if(queryIdPinpad == ""){
          return res.status(401).json({ error: 'Id not registered!'})
      }
      //Fim

      //Validação do campo "serial_pinpad"
      if(serial_pinpad){
        const querySerial_pinpad = await knex('pinpads')
          .select('id','serial_pinpad')
          .where({ serial_pinpad })       

        if(querySerial_pinpad != ""){
          const [{id}] = querySerial_pinpad

          if(id != req.params.id) {
            return res.status(401).json({ error: 'This PinPad serial number is already registered!'})
          }
        }
      }
      //Fim
      
      //Validação do campo "serial_cielo"
      if(serial_cielo){
        const querySerial_cielo = await knex('pinpads')
          .select('id','serial_cielo')
          .where({ serial_cielo })       

        if(querySerial_cielo != ""){
          const [{id}] = querySerial_cielo

          if(id != req.params.id) {
            return res.status(401).json({ error: 'This Cielo serial number is already registered!'})
          }
        }
      }
      //Fim

      await knex('pinpads')
      .update({ model, serial_pinpad, serial_cielo, cable_length, user_id }) 
      .where({ id })
      
      return res.json({
        model, 
        serial_pinpad, 
        serial_cielo,
        cable_length,
        user_id
      })

    } catch (error) {
      next(error)
    }

  },
  async deletePinpad(req, res, next) {
    try {
      const schema = yup.object().shape({
        serial_cielo: yup.string().required(),
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' })
      }
      const { serial_cielo } = req.body

      await knex('pinpads')
      .where({ serial_cielo })
      .delete()

      const status = "exchange";
      const situacion = "inactive";
      const protocol = "pending request";

      await knex('pinpads')
      .update({ status, situacion, protocol }) 
      .where({ id })
      
      return res.send()

    } catch (error) {
      next(error)
    }

  },
  async installPinpad(req, res, next) {
    try {
      const schema = yup.object().shape({
        serial_cielo: yup.string().required(),
        affiliate: yup.string().required(),
        cashier: yup.string().required()
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' })
      }

      const { serial_cielo, affiliate, cashier } = req.body

      const queryPinpad = await knex('pinpads')
        .select('id')
        .where({ serial_cielo }) 
      
      if(queryPinpad == ""){
        return res.status(401).json({ error: "Pinpad not registered in the database!"})
      }

      const [{id}] = queryPinpad
      const pinpad_id = id

      const queryInstall = await knex('branches')
        .select('affiliate','cashier')
        .where({ pinpad_id }) 

      if(queryInstall != ""){
        const [ { affiliate, cashier } ] = queryInstall
        return res.status(401).json({ error: `This pinpad is installed in branch ${affiliate} in ${cashier}`})
      }

      const queryValidationInstall = await knex('branches')
        .select('id')
        .where({ affiliate })
        .andWhere({ cashier })
        .andWhere({ pinpad_id }) 

      if(queryValidationInstall != ""){
        return res.status(401).json({ error: "There is a pinpad installed in this box!"})
      }
        
      await knex('branches')
        .update({ pinpad_id }) 
        .where({ affiliate })
        .andWhere( { cashier })

      const status = "instaled"

      await knex('pinpads')
      .update({ status }) 
      .where({ id })
      
      return res.json({
        affiliate, 
        cashier, 
        pinpad_id
      })
    
    } catch (error) {
        next(error)
    } 
  },
}
