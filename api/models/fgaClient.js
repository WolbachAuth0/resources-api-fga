const { CredentialsMethod, OpenFgaClient } = require('@openfga/sdk')

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
console.log(options)
const fgaClient = new OpenFgaClient(options)

module.exports = fgaClient