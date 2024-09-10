/**
 * Create an instance of the Auth0 Management API client
 * with the provided scopes.
 * 
 * @param {String[]} scopes 
 * @returns {Object} Instance of Management API Client
 */
const { AuthenticationClient } = require('auth0')
try {
  const options = {
    domain: process.env.AUTH0_CUSTOM_DOMAIN,
    clientId: process.env.FRONTEND_AUTH0_CLIENT_ID,
    clientSecret: process.env.FRONTEND_AUTH0_CLIENT_SECRET,
    audience: process.env.AUDIENCE,
    // scope: scopes.join(' ')
  }
  const AuthenticationClient = require('auth0').AuthenticationClient
  const authentication = new AuthenticationClient(options)
} catch (err) {
  console.log('An error occurred while instantiating authentication api client.')
  throw err
}

// Documentation
// https://auth0.github.io/node-auth0/classes/auth.AuthenticationClient.html
module.exports = authentication