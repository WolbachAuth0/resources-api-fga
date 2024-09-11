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
  .delete(
    fgaCheck('can_delete'),
    resources.remove
  )
  
router
  .route('/:resource_id/relations')
  .all(verifyJWT)
  .get(
    resources.listRelations
  )

router
  .route('/:resource_id/invitation')
  .all(verifyJWT)
  .post(
    fgaCheck('can_share'),
    schemaValidator(resources.schemas.invitation),
    resources.invite
  )