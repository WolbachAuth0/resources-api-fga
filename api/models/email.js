const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './../.env') })

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: '2525',
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PW
  }
})

module.exports = transporter