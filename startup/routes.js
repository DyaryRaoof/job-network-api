const express = require('express');

const user = require('../routes/users');
// const contactModel = require('../routes/contacts')

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/user', user);
  // app.use('/api/contact-model', contactModel)
  // app.use('/api/notification', notification)
};
