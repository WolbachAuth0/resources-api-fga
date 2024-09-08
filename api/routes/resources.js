const router = require('express').Router()
// middleware
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const fga = require('./../models/FGA')
const schemaValidator = require('./../middleware/schemaValidator')

// route logic
const resources = require('./../controllers/resources')

module.exports = router

router
  .route('/')
  .all(verifyJWT)
  .get(
    fga.listObjects('doc'),
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
    fga.check('can_read'),
    resources.getById
  )
  .put(
    fga.check('can_update'),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .patch(
    fga.check('can_update'),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .post(
    resources.setAccess
  )
  .delete(
    fga.check('can_delete'),
    resources.remove
  )
  
