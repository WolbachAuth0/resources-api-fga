const router = require('express').Router()
// middleware
const { verifyJWT, checkJWTScopes, fgaCheck } = require('./../middleware/auth')
const schemaValidator = require('./../middleware/schemaValidator')

// route logic
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
    fgaCheck('can_read'),
    resources.getById
  )
  .put(
    // checkJWTScopes(['update:resource'], options),
    fgaCheck('can_write'),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .patch(
    // checkJWTScopes(['update:resource'], options),
    fgaCheck('can_update'),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .post(
    // schemaValidator(resources.schemas.tuples),
    resources.setAccess
  )
  .delete(
    // checkJWTScopes(['delete:resource'], options),
    fgaCheck('can_delete'),
    resources.remove
  )
  
