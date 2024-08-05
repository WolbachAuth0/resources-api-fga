const responseFormatter = require('./../middleware/responseFormatter')
const Resource = require('./../models/Resource')
const resource = new Resource()

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

function list (req, res, next) {
  const query = req.query
  const resources = resource.list(query)
  const payload = {
    status: 200,
    message: `Found ${resources.length} resources matching your query.`,
    data: resources
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

function getById (req, res, next) {
  const resource_id = req.params.resource_id
  const data = resource.getById({ resource_id })
  const payload = {
    status: data ? 200 : 404,
    message: data ? `Fetched resource with id ${resource_id}` : `Resource with id ${resource_id} not found.`,
    data
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

function create (req, res, next) {
  const { text, author } = req.body
  const data = resource.create({ text, author })
  const payload = {
    status: 201,
    message: `Created resource with id ${data.resource_id}`,
    data
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

function update (req, res, next) {
  const resource_id = req.params.resource_id
  const { text, author } = req.body
  const data = resource.update({ resource_id, text, author })
  const payload = {
    status: 200,
    message: `Updated resource with id ${resource_id}`,
    data
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}

function remove (req, res, next) {
  const resource_id = req.params.resource_id
  const data = resource.remove({ resource_id })
  const payload = {
    status: 200,
    message: `Deleted resource with id ${resource_id}`,
    data
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}