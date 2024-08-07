const router = require('express').Router()
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')
const resources = require('./../controllers/resources')

module.exports = router

router
  .route('/')
  .all(verifyJWT)
  .get(
    resources.list
  )
  .post(
    schemaValidator(resources.schemas.quotation),
    resources.create
  )

router
  .route('/:resource_id')
  .all(verifyJWT)
  .get(
    // checkJWTScopes(['read:resource'], options),
    resources.getById
  )
  .put(
    // checkJWTScopes(['update:resource'], options),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .patch(
    // checkJWTScopes(['update:resource'], options),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .post(
    // schemaValidator(resources.schemas.tuples),
    resources.setAccess
  )
  .delete(
    // checkJWTScopes(['delete:resource'], options),
    resources.remove
  )
  
