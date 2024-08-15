const responseFormatter = require('./../middleware/responseFormatter')
const Resource = require('./../models/Resource')
const resource = new Resource()

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  setAccess,
  schemas: {
    quotation: Resource.schema
  }
}

function list (req, res, next) {
  const objects = req?.objects
  const ids = objects && Array.isArray(objects) ? objects.map(x => parseInt(x.split(':')[1])) : [];
  console.log(objects, ids)

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
  const data = resource.create(req.body)
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
  const { title, text, author } = req.body
  const data = resource.update({ resource_id, title, text, author })
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

async function setAccess(req, res, next) {
  const resource_id = req.params.resource_id
  const user_id = req.auth.sub
  console.log(user_id)
  // TODO: call FGA Client and CRUD auth tuples
  const data = req.body
  const payload = {
    status: 200,
    message: `Updated access to resource with id ${resource_id}`,
    data
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}
