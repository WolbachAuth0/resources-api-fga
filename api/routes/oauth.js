const router = require('express').Router()
const controller = require('./../controllers/oauth')

module.exports = router

router
  .route('/token')
  .post(
    controller.getToken
  )
