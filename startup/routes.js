const express = require('express');

const user = require('../routes/users');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/user', user);
};
