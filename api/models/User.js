const management = require('./../models/management')
const errorHandler = require('./ErrorHandler')

class User {
  constructor ({ id }) {
    const scopes = [
      'read:users',
      'read:user_idp_tokens',
      'update:users',
      'update:users_app_metadata'
    ]
    this.api = management(scopes)
    
    const idComponents = id.split('|')
    
    this._id = id
    this._uuid = idComponents[idComponents.length - 1]
    this._connection = id.split('|').slice(0,-1).join('|')
  }

  get id () { return this._id }
  get uuid () { return this._uuid }
  get connection () { return this._connection }

  // STATIC METHODS

  static async listAll ({ q=undefined, per_page=10, page=0 }) {
    // Pagination settings.
    const params = {
      search_engine: 'v3',
      q,
      per_page,
      page
    }
    const api = management([ 'read:users' ])
    const users = await api.getUsers(params)
    return users
  }

  // INSTANCE METHODS

  async getProfile () {
    try {
      const data = await this.api.getUser({ id: this.id })
      const payload = {
        status: 200,
        message: `Found user by id: ${this.id}.`,
        data 
      }
      return payload
    } catch (error) {
      return errorHandler(error)
    }
  }

  async updateProfile ({ body }) {
    const idp = this.connection.split('|')[0]

    if (!['auth0', 'email', 'sms'].includes(idp)) {
      // can't update - throw 400 bad request
      return {
        status: 400,
        message: `Cannot update users of connection type ${this.connection}.`,
        data: error
      }
    }
    
    try {
      const data = await this.api.updateUser({ id: this.id }, body)
      const payload = {
        status: 200,
        message: `Updated user ${this.id}.`,
        data 
      }
      return payload
    } catch (error) {
      return errorHandler(error)
    }
  }

}
module.exports = User