const checkJWTScopes = require('express-jwt-authz')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const fgaClient = require('./../models/fgaClient')
const responseFormatter = require('./../middleware/responseFormatter')

/**
 * Verify JWT issued via Authorization Code Flow w/PKCE to user
 * 
 * NOTE: This expects the token issuer to be the custom domain.
 */ 
const verifyJWT = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_CUSTOM_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUDIENCE,
  issuer: `https://${process.env.AUTH0_CUSTOM_DOMAIN}/`,
  algorithms: ['RS256']
})

function checkJWTPermissions (permissions) {
  const customScopeKey = 'permissions'
  const failWithError = true
  return checkJWTScopes(permissions, { customScopeKey, failWithError })
}

function fgaCheck (relation) {
  return async function (req, res, next) {
    const user_id = req?.auth?.user_id || req?.auth?.sub
    const resource_id = req.params.resource_id
    const activity = relation.replace('can_','').replace('_', ' ')
    const tuple = {
      user: `user:${user_id}`,
      relation: relation,
      object: `doc:${resource_id}`
    }

    const { allowed } = await fgaClient.check(tuple)
    
    if (allowed) {
      next()
    } else {
      const payload = {
        status: 401,
        message: `User ${user_id} is not authorized to ${activity} resource ${resource_id}`,
        data: {}
      }
      const json = responseFormatter(req, res, payload)
      res.status(payload.status).json(json)
    }
  }
}

module.exports = {
  verifyJWT,
  checkJWTScopes,
  checkJWTPermissions,
  fgaCheck
}