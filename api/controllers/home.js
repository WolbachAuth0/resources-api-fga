const responseFormatter = require('./../middleware/responseFormatter')
const authenticationAPI = require('./../models/authenticationAPI')

module.exports = {
  hello,
  login
}

function hello (req, res) {
  const payload = {
    status: 200,
    message: 'Hello from the API server !',
    data: {}
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

function login (req, res) {
  const query = Object.assign(req.query, {
    response_type: 'code',
    client_id: process.env.FRONTEND_AUTH0_CLIENT_ID,
    redirect_uri: `${process.env.FRONTEND_DOMAIN}/profile`,
    response_mode: 'query'
  })
  const qs = new URLSearchParams(query).toString()
  const to = `https://${process.env.AUTH0_CUSTOM_DOMAIN}/authorize?${qs}`
  res.redirect(to)
}
