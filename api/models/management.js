/**
 * Create an instance of the Auth0 Management API client
 * with the provided scopes.
 * 
 * documentation on the management API client
 * https://auth0.github.io/node-auth0/classes/management.ManagementClient.html
 * 
 * @param {String[]} scopes 
 * @returns {Object} Instance of Management API Client
 */
module.exports = function (scopes) {
  try {
    const options = {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_API_ID,
      clientSecret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      scope: scopes.join(' ')
    }
    const ManagementClient = require('auth0').ManagementClient
    const management = new ManagementClient(options)
    return management
  } catch (err) {
    console.log('An error occurred while instantiating management api client.')
    throw err
  }
}
