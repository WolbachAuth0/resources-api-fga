const { CredentialsMethod, OpenFgaClient } = require('@openfga/sdk')
const responseFormatter = require('../middleware/responseFormatter')
const { logger } = require('./logger')

class FGA {
  constructor () {
    const options = {
      apiUrl: process.env.OKTA_FGA_BASE_URL,
      storeId: process.env.OKTA_FGA_STORE_ID,
      // authorizationModelId: process.env.FGA_MODEL_ID, // Optional, can be overridden per request
      credentials: {
        method: CredentialsMethod.ClientCredentials,
        config: {
          apiTokenIssuer: process.env.OKTA_FGA_API_TOKEN_ISSUER,
          apiAudience: process.env.OKTA_FGA_API_AUDIENCE,
          clientId: process.env.OKTA_FGA_CLIENT_ID,
          clientSecret: process.env.OKTA_FGA_CLIENT_SECRET,
        }
      }
    }
    const client = new OpenFgaClient(options)
    this._client = client
  }

  get client() {
    return this._client
  }

  /**
   * 
   * @param {string} relation 
   * @returns Express.js middleware function
   */
  check (relation) {
    const fgaClient = this._client

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
      } catch (error) {
        next(error)
      }
    }
  }

  /**
   * Lists all objects of type "type" which the user has the relationship "relation" to.
   * Appends the result set to the "objects" property of the request object
   * 
   * @param {string} relation the relationship to check for
   * @param {string} type the object type
   * @returns Express.js middleware function
   */
  listObjects(relation, type) {
    const fgaClient = this._client
    
    return async function (req, res, next) {
      const user_id = req?.user?.sub
      
      const tuple = {
        user: `user:${user_id}`,
        relation,
        type
      }

      try {
        const { objects } = await fgaClient.listObjects(tuple)
        const ids = objects && Array.isArray(objects) ? objects.map(x => parseInt(x.split(':')[1])) : [];
        req.resource_ids = ids
        next()
      } catch (error) {
        next(error)
      }
    }
  }

}


const fga = new FGA()

module.exports = fga