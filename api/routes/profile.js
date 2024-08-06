const router = require('express').Router()
const { verifyJWT, checkJWTScopes } = require('./../middleware/auth')
const profile = require('./../controllers/profile')

module.exports = router

function checkJWTUserID (req, res, next) {
  const userIDs = [ req.params.user_id ]
  const options = {
    customScopeKey: 'sub',
    failWithError: true
  }
  return checkJWTScopes(userIDs, options)(req, res, next)
}

router.route('/:user_id')
  .all(verifyJWT)
  .all(checkJWTUserID)
  .get(
    profile.getUserProfile
  )
  .patch(
    // schemaValidator(),
    profile.updateProfile 
  )
