const responseFormatter = require('./../middleware/responseFormatter')

const User = require('./../models/User')
const Client = require('./../models/Client')

module.exports = {
  // User Endpoints
  getUserProfile,
  updateProfile,

}

// User Endpoints
async function getUserProfile (req, res, next) {
  const id = req.params.user_id

  const user = new User({ id })
  const payload = await user.getProfile()
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

async function updateProfile (req, res, next) {
  const id = req.params.user_id
  const body = req.body

  const user = new User({ id })
  const payload = await user.updateProfile({ body })
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}
