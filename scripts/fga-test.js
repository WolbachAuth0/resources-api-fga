const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './../.env') })

const fga = require('./../api/models/FGA')

main()

async function main () {
  const user_id = 'auth0|66b171a53141b01fb58990f5'
  const resource_id = '1'
  const options = {
    user: `user:${user_id}`,
    object: `doc:${resource_id}`
  }

  const relations = await fga.listRelations(options)
  console.log(relations)
}