const path = require('path')
require('dotenv').config({ path: path.join(__dirname, './../.env.test') })
const Resource = require('./../api/models/Resource')

main()

async function main () {
  const resource = new Resource({ resource: 'posts' })
  let payload;
  // create
  const body = {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
  payload = await resource.create(body)
  console.log('create resource', payload)

  // read
  payload = await resource.getById({ resource_id: '1' })
  console.log('\nread resource', payload)

  // update
  payload = await resource.update({ resource_id: '1' }, body)
  console.log('\nupdate resource', payload)

  // delete
  payload = await resource.remove({ resource_id: '1' })
  console.log('\ndelete resource', payload)
}
