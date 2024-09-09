const router = require('express').Router()
// middleware
const { verifyJWT, fgaCheck, listObjects } = require('./../middleware/auth')
const fga = require('./../models/FGA')
const schemaValidator = require('./../middleware/schemaValidator')

// route logic
const resources = require('./../controllers/resources')

module.exports = router

router
  .route('/')
  .all(verifyJWT)
  .get(
    listObjects('doc'),
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
    check('can_read'),
    resources.getById
  )
  .put(
    check('can_update'),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .patch(
    check('can_update'),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .post(
    resources.setAccess
  )
  .delete(
    check('can_delete'),
    resources.remove
  )
  
