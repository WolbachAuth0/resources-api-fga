

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './../.env') })
const transporter = require('./../api/models/email')

main()

async function main () {
  const baseURL = `https://${process.env.AUTH0_CUSTOM_DOMAIN}/authorize?`
  const query = {
    response_type: 'token',
    client_id: process.env.FRONTEND_AUTH0_CLIENT_ID,
    connection: 'email',
    redirect_uri: `https://app.documents.awolcustomdemos.com/documents?resource_id=1`,
    scope:'openid profile email'
  }
  const qs = new URLSearchParams(query).toString()
  const mailOptions = {
    from: '',
    to: 'guest.user@gmail.com',
    subject: 'You have been invited to a document',
    html: `Please <a href="${baseURL}${qs}">login</a> to inspect your document.`
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(info)
  } catch (error) {
    console.log(error)
  }
}