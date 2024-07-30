const responseFormatter = require('./../middleware/responseFormatter')
const Resource = require('./../models/Resource')
const resource = new Resource({ resource: 'posts' })

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  schemas: {
    // createResource: {}
    // updateResource: {}
    // postResource: {}
    // patchResource: {}
  }
}

async function list (req, res, next) {
  const query = req.query
  
  const payload = await resource.list(query)
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

async function getById (req, res, next) {
  const resource_id = req.params.resource_id

  const payload = await resource.getById({ resource_id })
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

async function create (req, res, next) {
  const body = req.body

  const payload = await resource.create(body)
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

async function update (req, res, next) {
  const resource_id = req.params.resource_id
  const body = req.body

  const payload = await resource.update({ resource_id }, body)
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

async function remove (req, res, next) {
  const resource_id = req.params.resource_id

  const payload = await resource.remove({ resource_id })
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}