const router = require('express').Router()
const responseFormatter = require('../middleware/responseFormatter')
const errorHandler = require('./../models/ErrorHandler')
const path = require('path')
const jsonfile = require('jsonfile')

module.exports = router

router
  .route('/specification')
  .get((req, res) => {
    // server/openapi-specs/redoc.html
    res.sendFile(path.join(__dirname, '../views/redoc.html'))
  })

router
  .route('/v1/specification')
  .get(async (req, res) => {
    const environ = process.env.NODE_ENV
    let openapispec = {}
    if (environ == 'production') {
      openapispec = await jsonfile.readFile(path.join(__dirname, '../openapi-docs/openapi.json'))
    } else if (environ == 'development') {
      openapispec = await jsonfile.readFile(path.join(__dirname, '../openapi-docs/openapi.dev.json'))
    } else {
      openapispec = require('./../openapi-docs')
    }

    res.json(openapispec)
  })

router
  .route('/hello')
  .get((req, res) => {
    try {
      const status = 200
      const message = 'Hello from the API server !'
      const data = {}
      const json = responseFormatter(req, res, { status, message, data })
      res.status(status).json(json)
    } catch (error) {
      console.log(error)
      const payload = errorHandler(error)
      const json = responseFormatter(req, res, payload)
      res.status(payload.status).json(json)
    }
  })

/**
  This endpoint has to be here to redirect invitation links to the signup screen.
  This is only relevant when using the Auth0 Organizations feature.
  
  http://localhost:8081/api/login?invitation=W6yRtawKU1wmi9vY9Y0GbjGSpEQErLvq&organization=org_poSk5O5ljabdHiKV&organization_name=okta
*/
router
  .route('/login')
  .get((req, res) => {
    const query = Object.assign(req.query, {
      response_type: 'code',
      client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
      redirect_uri: `${process.env.VUE_APP_DOMAIN}/profile`,
      response_mode: 'query'
    })
    const qs = new URLSearchParams(query).toString()
    const to = `https://${process.env.VUE_APP_CUSTOM_DOMAIN}/authorize?${qs}`
    res.redirect(to)
  })
