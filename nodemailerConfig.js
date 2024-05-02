// nodemailerConfig.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '4c86be0aa70d43',
    pass: '87be3c8a365011',
  },
});

console.log('Nodemailer transporter created with configuration:', transporter.options);

module.exports = transporter;
