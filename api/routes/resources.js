const router = require('express').Router()
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')
const resources = require('./../controllers/resources')

module.exports = router

const options = { failWithError: true }

router
  .route('/')
  .all(verifyJWT)
  .get(
    resources.list
  )
  .post(
    checkJWTScopes(['create:resource'], options),
    // schemaValidator(),
    resources.create
  )

router
  .route('/:resource_id')
  .all(verifyJWT)                               // verify signature on access token
  .get(
    checkJWTScopes(['read:resource'], options), // verify access token contains necessary permission(s)
    resources.getById                           // execute the get User by Id function
  )
  .put(
    checkJWTScopes(['update:resource'], options),
    // schemaValidator(),
    resources.update
  )
  .patch(
    checkJWTScopes(['update:resource'], options),
    // schemaValidator(),
    resources.update
  )
  .delete(
    checkJWTScopes(['delete:resource'], options),
    resources.remove
  )
  