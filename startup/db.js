const mongoose = require('mongoose');
const winston = require('winston');

var mongooseDB;

module.exports = async () => {
  //  const db = config.get('db');

  // const db = process.env.db_gentleman;
  //  const db = 'mongodb+srv://dyary:Shwanbalabarz90@bazzar.0qjbe.mongodb.net/bazzar?retryWrites=true&'
  const db = 'mongodb://localhost/job-network-db';
  mongooseDB = await mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => winston.info(`connected to ${db}`))
    .catch((err) => winston.error('Could not connect to mongoDB', err));
};

module.exports.mongooseDB = mongooseDB;
