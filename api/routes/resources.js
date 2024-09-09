const router = require('express').Router()
// middleware
const { verifyJWT, fgaCheck, listObjects } = require('./../middleware/auth')
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
    fgaCheck('can_read'),
    resources.getById
  )
  .put(
    fgaCheck('can_update'),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .patch(
    fgaCheck('can_update'),
    schemaValidator(resources.schemas.quotation),
    resources.update
  )
  .post(
    resources.setAccess
  )
  .delete(
    fgaCheck('can_delete'),
    resources.remove
  )
  
