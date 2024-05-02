// nodemailerConfig.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'drkatanga2020@gmail.com',
    pass: 'Micha@21985467',
  },
});

module.exports = transporter;
