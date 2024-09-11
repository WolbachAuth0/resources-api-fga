const responseFormatter = require('./../middleware/responseFormatter')
const transporter = require('./../models/email')
const fga = require('./../models/FGA')

const Resource = require('./../models/Resource')
const resource = new Resource()

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  invite,
  listRelations,
  schemas: {
    quotation: Resource.schema,
    invitation: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'The email address to send the invite to.'
        }
      },
      required: ['email']
    }
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

async function invite (req, res, next) {
  const { email } = req.body
  const resource_id = req.params.resource_id
  const user_id = req?.user?.sub
  const tuple = {
    user_id: 'email|66e0e661af53e2c0ae541e26',
    relation: 'viewer',
    resource_id
  }

  

  // send invite email
  const baseURL = `https://${process.env.AUTH0_CUSTOM_DOMAIN}/authorize?`
  const query = {
    response_type: 'token',
    client_id: process.env.FRONTEND_AUTH0_CLIENT_ID,
    connection: 'email',
    redirect_uri: `https://app.documents.awolcustomdemos.com/documents?resource_id=1`,
    scope:'openid profile email'
  }
  const qs = new URLSearchParams(query).toString()

  const mailOptions = {
    from: '',
    to: 'guest.user@gmail.com',
    subject: 'You have been invited to a document',
    html: `Please <a href="${baseURL}${qs}">login</a> to inspect your document.`
  }

  transporter.sendMail(mailOptions, async function (err, info) {

    if (err) {
      payload = {
        status: 500,
        message: err.message || 'An error occurred.',
        data: err
      }
      const json = responseFormatter(req, res, payload)
      return res.status(payload.status).json(json)
    }

    // update tuple
    try {
      fga.writeTuple(tuple)
    } catch (error) {
      const payload = {
        status: 500,
        message: err.message || 'An error occurred.',
        data: err
      }
      const json = responseFormatter(req, res, payload)
      return res.status(payload.status).json(json)
    }

    const payload = {
      status: 201,
      message: `Invitation to doc:${resource_id} sent to ${email} by ${user_id}.`,
      data: {}
    }
    const json = responseFormatter(req, res, payload)
    res.status(payload.status).json(json)
  })

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