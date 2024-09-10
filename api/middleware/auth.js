const checkJWTScopes = require('express-jwt-authz')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const fga = require('./../models/FGA')

/**
 * Verify JWT issued via Authorization Code Flow w/PKCE to user
 * 
 * NOTE: This expects the token issuer to be the custom domain.
 * the verifyJWT function writes the decoded access token to the 
 * req.user object
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
    const user_id = req?.user.sub
    const resource_id = req.params.resource_id
    const activity = relation.replace('can_','').replace('_', ' ')
    const tuple = {
      user: `user:${user_id}`,
      relation: relation,
      object: `doc:${resource_id}`
    }

    try {
      const allowed = await fga.check(tuple)
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
}

function listObjects (type) {
  return async function (req, res, next) {
    const user_id = req?.user?.sub
    const relations = req.query?.relations?.split(',') || ['owner']
    
    try {
      let temp = []
      for (let relation of relations) {
        const tuple = {
          user: `user:${user_id}`,
          relation,
          type
        }
        const ids = await fga.listObjects(tuple)
        temp.push(ids)
      }
      // process array
      temp = temp
        .flat()
        .sort((a, b) => a - b);

      req.resource_ids = [...new Set(temp)]
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  verifyJWT,
  checkJWTScopes,
  checkJWTPermissions,
  fgaCheck,
  listObjects
}