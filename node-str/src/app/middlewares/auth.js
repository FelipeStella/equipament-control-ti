'use strict';

const jwt = require('jsonwebtoken');
const { promisify }= require('util');

const authConfig = require('../../config/auth');

module.exports = async (req, res, next) => {
  const AuthHeader = req.headers.authorization;

  if(!AuthHeader){
    return res.status(401).json({ error: 'Token not provided!' });
  }
  
  const [, token] = AuthHeader.split(' ');

  try {

    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id

    return next();

  } catch(error){
    return res.status(401).json({ error: 'Token invalid!' });
  }

}
