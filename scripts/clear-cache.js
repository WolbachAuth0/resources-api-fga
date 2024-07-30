const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './../.env') })
const cache = require('./../api/models/Cache')

main()

async function main () {
  try {
    console.log('connecting to REDIS ...')
    await cache.connect()
    console.log('connected. fetching keys ...')
    const keys = await cache.redis.keys('*')
    console.log('keys found: ', keys)
    if (keys.length > 0) {
      const response = await cache.deleteKeys({ keys })
      console.log(`deleted ${response} keys`)
    }
  } catch (error) {
    console.error(error)
  } finally {
    console.log('disconnecting from REDIS ...')
    await cache.disconnect()
    console.log('successfully disconnected.')
  }
}