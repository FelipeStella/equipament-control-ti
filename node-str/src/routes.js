'use strict';

const express = require('express');
const routes = express.Router();

const userController = require('../src/app/controllers/UserController');
const pinpadController = require('../src/app/controllers/PinpadController');
const sessionController = require('../src/app/controllers/SessionController');
const authMiddleware = require('../src/app/middlewares/auth')

routes
  //Sessions
  .post('/sessions', sessionController.validation)

  //Users
  .get('/users', authMiddleware, userController.findAllUsers)
  .post('/users', userController.createUser)
  .put('/users', authMiddleware, userController.updateUser)
  .delete('/users', authMiddleware, userController.deleteUser)

  //Pinpads
  .use(authMiddleware)

  .get('/pinpads', pinpadController.findPinpads)
  .post('/pinpads', pinpadController.createPinpad)
  .put('/pinpads/:id', pinpadController.updatePinpad)
  .delete('/pinpads', pinpadController.deletePinpad)
  .put('/install', pinpadController.installPinpad)

module.exports = routes;