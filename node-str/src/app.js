'use strict';

const express = require('express');
const Youch = require('youch');
const Sentry = require('@sentry/node');

require('express-async-errors');
require('dotenv/config');

const routes = require('./routes');
const sentryConfig = require('./config/sentry');

//const app = express();

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
  
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error!'});
    })
  }
}

module.exports = new App().server;

/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
  extended: false
}));

Sentry.init(sentryConfig);
app.use(Sentry.Handlers.requestHandler());

app.use('/', routes);

app.use(Sentry.Handlers.errorHandler());



module.exports = app;*/