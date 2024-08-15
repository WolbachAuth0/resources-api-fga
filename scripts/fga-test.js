const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './../.env') })
require('dotenv').config({ path: path.join(__dirname, './../.env.development') })

const fga = require('./../api/models/FGA')

main()

async function main () {
  await fga.testMe()
}