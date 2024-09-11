const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './../.env') })
const authenticationAPI = require('./../api/models/authenticationAPI')

main()

async function main () {
  await authenticationAPI.passwordless.sendEmail({
    email: 'guest.user@gmail.com',
    send: 'link',
    authParams: {} // Optional auth params.
  })
}