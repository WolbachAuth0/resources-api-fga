const router = require('express').Router()
const controller = require('./../controllers/home')

module.exports = router

router
  .route('/')
  .get(
    controller.hello
  )

/**
  This endpoint has to be here to redirect invitation links to the signup screen.
  This is only relevant when using the Auth0 Organizations feature.
  
  http://localhost:8081/api/login?invitation=W6yRtawKU1wmi9vY9Y0GbjGSpEQErLvq&organization=org_poSk5O5ljabdHiKV&organization_name=okta
*/
router
  .route('/login')
  .get((req, res) => {
    controller.login
  })
