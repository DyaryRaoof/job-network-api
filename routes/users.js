const multiparty = require('connect-multiparty');
const multipartyMiddleware = multiparty();
const { User } = require('../models/user');
// const {createFilesAWS,readsFilesAWS,readFileSingleAWS} = require('../customFunctions/awsCRUD');
const express = require('express');
const router = express.Router();
// const winston = require('winston');
const _ = require('lodash');
// const passwordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

router.use(multipartyMiddleware);
router.use(express.json());

router.post('/', async (req, res) => {
  reqJson = JSON.parse(req.body.json);
  const _user = new User(reqJson);

  let user = await User.findOne({ email: _user.email }).select('-password');
  if (user && user != '') {
    res.status(400).send('User already registered, please log in !');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  _user.password = await bcrypt.hash(_user.password, salt);
  await _user.save();

  const webToken = user.generateAuthToken();

  // res.header('x-auth-token', webToken).send(_.pick(_user, 'name', 'email','_id', 'isLoggedIn', 'city', 'profileImageURL'));
  res.headers('x-auth-token', webToken).send(_.pick(_user, 'name', 'email', '_id'));
});

router.post('/login', async (req, res) => {
  reqJson = JSON.parse(req.body.json);

  const _user = new User(reqJson);

  const _password = _user.password;
  const _email = _user.email;

  const user = await User.findOne({ email: _email });
  if (user) {
    const isValidated = await bcrypt.compare(_password, user.password);
    if (isValidated == true) {
      const webToken = user.generateAuthToken();
      res.header('x-auth-token', webToken).send(_.pick(user, 'name', 'email', '_id'));
      await user.save();
    } else {
      res.status(400).send('Wrong user name or password');
    }
  } else {
    res.status(400).send('Wrong user name or password');
  }
});

// router.post('/get-new-password/:email', async (req, res) => {
//   const email = req.params.email;

//   let user = await User.findOne({ email: email });
//   if (!user) {
//     res.status(400).send('No user found with this email!');
//     return;
//   }

//   await sendPasswordResetEmail(user, req);
//   res.send('email sent successfully');
// });

// router.post('/change-password', async (req, res) => {
//   idWithQoutes = req.body.id;
//   password = req.body.password;

//   const id = idWithQoutes.substring(1, idWithQoutes.length - 1);

//   let user = await User.findOne({ _id: id }).select('-password');
//   if (!user) {
//     res.status(400).send('No such user in the databse !');
//     return;
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);

//   user.password = hash;
//   await user.save();
//   //res.send('hello world');
//   res.status(200).sendFile('./views/reset-successful.html', { root: __dirname });
// });

// router.get('/password-response-form', async (req, res) => {
//   res.sendFile('./views/reset.html', { root: __dirname });
// });

// const sendPasswordResetEmail = async (user, req) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'gentlemanapplogin@gmail.com',
//       pass: 'gentlemanjamesalan',
//     },
//   });

//   const getPasswordResetURL = (user, hash) => `${req.protocol}://${req.get('host')}/api/user/password-response-form?id="${user._id}"`;

//   console.log(getPasswordResetURL(user));

//   const resetPasswordTemplate = (user, url) => {
//     const from = 'gentlemanapplogin@gmail.com';
//     const to = user.email;
//     const subject = '🌻 Gentleman App Password Reset 🌻';
//     const html = `
//           <p>Hey ${user.displayName || user.email},</p>
//           <p>We heard that you lost your Gentleman app password. Sorry about that!</p>
//           <p>But don’t worry! You can use the following link to reset your password:</p>
//           <a href=${url}>${url}</a>
//           <p>If you don’t use this link within 1 hour, it will expire.</p>
//           <p>Do something outside today! </p>
//           <p>–Your friends at Gentleman App</p>
//           `;

//     return { from, to, subject, html };
//   };

//   const url = getPasswordResetURL(user, user.password);
//   const emailTemplate = resetPasswordTemplate(user, url);
//   const sendEmail = () => {
//     transporter.sendMail(emailTemplate, (err, info) => {
//       if (err) {
//         res.status(500).json('Error sending email');
//       }
//       console.log(`** Email sent **`);
//     });
//   };
//   sendEmail();

//   return;
// };

module.exports = router;
