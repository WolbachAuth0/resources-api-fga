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
  async check ({ user, relation, object }) {
    const { allowed } = await fgaClient.check({ user, relation, object })
    return allowed
  }

  /**
   * Lists all objects of type "type" which the user has the relationship "relation" to.
   * Appends the result set to the "objects" property of the request object
   * 
   * @param {string} relation the relationship to check for
   * @param {string} type the object type
   * @returns Express.js middleware function
   */
  async listObjects({ user, relation, type }) {
    const { objects } = await this.client.listObjects({ user, relation, type })
    const ids = objects && Array.isArray(objects) ? objects.map(x => parseInt(x.split(':')[1])) : [];
    return ids
  }

  async listRelations ({ user, object }) {
    const relations = [
      'can_change_owner',
      'can_delete',
      'can_read',
      'can_share',
      'can_update',
      'owner',
      'viewer'
    ]
    const response = await this.client.listObjects({ user, object, relations })
    return response.relations      
  }

}

const fga = new FGA()

module.exports = fga