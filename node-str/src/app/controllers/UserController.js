'use strict';

const bcrypt = require('bcryptjs');
const yup = require('yup');

const knex = require('../../database');

module.exports = {
  async findAllUsers(req, res, next) {
    try{
      const results = await knex('users')
        .select('company_registration','username')
        .where('deleted_at', null)

      return res.json(results)
    }catch (error) {
      next(error)
    }
      
  },
  async createUser(req, res, next) {
    try {
      const schema = yup.object().shape({
        company_registration: yup.number().required(),
        username: yup.string().required(),
        password: yup.string()
          .required()
          .min(6),
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' })
      }

      const { company_registration, username, password } = req.body

      const password_hash = bcrypt.hashSync(password, 8)

      await knex('users').insert({
        company_registration,
        username,
        password_hash
      }) 
      
      return res.json({
        company_registration,
        username,
      })
    } catch (error) {
      next(error)
    }
    
  },
  async updateUser(req, res, next) {
    try {
      const schema = yup.object().shape({
        company_registration: yup.number(),
        username: yup.string(),
        oldPassword: yup.string().min(6),
        password: yup.string()
          .min(6)
          .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required() : field
          ),
        confirmPassword: yup.string()
          .when('password', (password, field) =>
            password ? field.required().oneOf([yup.ref('password')]) : field
          )

      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' })
      }
      const idReq = req.userId

      const { company_registration, username, oldPassword, password } = req.body

      //Validação do campo "company_registration"
      const queryUserId = await knex('users')
        .select('id')
        .where({ company_registration })       

      if(queryUserId != ""){
        const [{id}] = queryUserId

        if(id != idReq) {
          return res.status(401).json({ error: 'a user already has this registration!'})
        }
      }
      //Fim

      //Validação do campo "username"
      const queryUsername = await knex('users')
        .select('id')
        .where({ username })       

      if(queryUsername != ""){
        const [{id}] = queryUsername

        if(id != idReq) {
          return res.status(401).json({ error: 'a user already has this username!'})
        }
      }
      //Fim

      const queryUserPasswordHash = await knex('users')
      .select('id','password_hash')
      .where( 'id', '=', idReq)

      const [{id}] = queryUserPasswordHash
      
      const user = knex('users')

      //Validação de senha
      if(oldPassword){
        const [{password_hash}] = queryUserPasswordHash
        if(!(await bcrypt.compare(oldPassword, password_hash))) {
          return res.status(401).json({ error: 'Password does not match'})
        }
      }
      //Fim

      //Atualização dos registro se o usuário digitou novo valor pra senha
      if(password){
        const password_hash = bcrypt.hashSync(password, 8)

        await user
          .update({ company_registration, username, password_hash }) 
          .where({ id })
      }
      //Fim

      //Atualização dos registros se o usuário não digitou novo valor pra senha
      else {
        await user
          .update({ company_registration, username }) 
          .where({ id })
      }
      //Fim
          
      return res.json({
        company_registration,
        username,
      })

    } catch (error) {
      next(error)
    }

  },
  async deleteUser(req, res, next) {
    try {
      const id = req.userId

      await knex('users')
      .where({ id })
      .update('deleted_at', new Date())
      
      return res.send()

    } catch (error) {
      next(error)
    }

  }
};
