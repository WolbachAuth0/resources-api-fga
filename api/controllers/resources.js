const responseFormatter = require('./../middleware/responseFormatter')
const Resource = require('./../models/Resource')
const fga = require('./../models/FGA')
const resource = new Resource()

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  setAccess,
  listRelations,
  schemas: {
    quotation: Resource.schema
  }
}

// CRUD methods
function list (req, res, next) {
  const resource_ids = req?.resource_ids
  const query = { resource_ids }
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
  const document = {
    resource_id: req.params.resource_id,
    title: req.body.title,
    text: req.body.text,
    author: req.body.author
  }
  const data = resource.update(document)
  const payload = {
    status: 200,
    message: `Updated resource with id ${document.resource_id}`,
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

// AuthZ FGA endpoints

async function setAccess(req, res, next) {
  const resource_id = req.params.resource_id
  const user_id = req?.user?.sub
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

async function listRelations (req, res, next) {
  const user_id = req?.user?.sub
  const resource_id = req.params.resource_id
  const options = {
    user: `user:${user_id}`,
    object: `doc:${resource_id}`
  }

  const relations = await fga.listRelations(options)
  const payload = {
    status: 200,
    message: `found ${relations.length} relationships between ${options.user} and ${options.object}.`,
    data: relations
  }
  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)

}