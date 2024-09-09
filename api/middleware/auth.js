const checkJWTScopes = require('express-jwt-authz')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const fga = require('./../models/FGA')

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

async function fgaCheck (req, res, next) {
  const user_id = req?.user.sub
  const resource_id = req.params.resource_id
  const activity = relation.replace('can_','').replace('_', ' ')
  const tuple = {
    user: `user:${user_id}`,
    relation: relation,
    object: `doc:${resource_id}`
  }

  try {
    const { allowed } = await fga.client.check(tuple)
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
  } catch (error) {
    next(error)
  }
}

async function listObjects (req, res, next) {
  const user_id = req?.user?.sub
  const relation = req.query?.relation || 'owner'
  const tuple = {
    user: `user:${user_id}`,
    relation,
    type
  }

  try {
    const { objects } = await fga.client.listObjects(tuple)
    const ids = objects && Array.isArray(objects) ? objects.map(x => parseInt(x.split(':')[1])) : [];
    req.resource_ids = ids
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  verifyJWT,
  checkJWTScopes,
  checkJWTPermissions,
  fgaCheck,
  listObjects
}