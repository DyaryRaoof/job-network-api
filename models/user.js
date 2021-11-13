const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },

  password: {
    type: String,
    // required: true,
    minlength: 5,
    maxlength: 1024,
    unique: true,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.generateAuthToken = function () {
  const secret = 'jobNetworkJwtPrivateKey';
  const token = jwt.sign({ _id: this._id }, secret);
  return token;
};

const User = mongoose.model('User', UserSchema);

module.exports.User = User;
module.exports.UserSchema = UserSchema;
