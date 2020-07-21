'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const yup = require('yup');

const knex = require('../../database');
const authConfig = require('../../config/auth');

module.exports = {
  async validation(req, res, next) {
    try{
      const schema = yup.object().shape({
        company_registration: yup.number().required(),
        password: yup.string().required()
      });

      if(!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' })
      }
      const { company_registration, password } = req.body;

      const user = await knex('users')
        .select('id','company_registration', 'username', 'password_hash')
        .where({ company_registration })

      if (user == "") {
        return res.status(401).json({ error: 'User not found' });
      }

      const [{id,username, password_hash}] = user  

      const checkPassword = await bcrypt.compare(password, password_hash);

      if(!checkPassword) {
        return res.status(401).json({ error: 'Password does not match' });
      }
      
      return res.json({company_registration, username, token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn, 
        }),
      })
    }catch (error) {
      next(error)
    }
      
  },
}
