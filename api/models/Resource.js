const axios = require('axios')
const errorHandler = require('./ErrorHandler')

class Resource {

  constructor ({ resource = 'posts' }) {
    // resource options are posts, comments, albums, photos
    const request = {
      baseURL: `https://jsonplaceholder.typicode.com/${resource}`,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json'
      }
    }
    this.config = request
    this.http = axios.create(this.config)
  }

  async list (query) {
    try {
      const response = await this.http.get('/')
      const payload = {
        status: 200,
        message: `Listed all resources`,
        data: response.data
      }
      return payload
    } catch (error) {
      console.log(error)
      return errorHandler(error)
    }
  }

  async getById ({ resource_id }) {
    try {
      // TODO: handle resource not found
      const response = await this.http.get(`/${resource_id}`)
      const payload = {
        status: 200,
        message: `Fetched resource with id ${resource_id}`,
        data: response.data
      }
      return payload
    } catch (error) {
      console.log(error)
      return errorHandler(error)
    }
  }

  async create (body) {
    try {
      const response = await this.http.post(`/`, body)
      const payload = {
        status: 201,
        message: `Created resource with id ${response.data.id}`,
        data: response.data
      }
      return payload
    } catch (error) {
      console.log(error)
      return errorHandler(error)
    }
  }

  async update ({ resource_id }, body) {
    try {
      const response = await this.http.put(`/${resource_id}`, body)
      const payload = {
        status: 200,
        message: `Updated resource with id ${response.data.id}`,
        data: response.data
      }
      return payload
    } catch (error) {
      console.log(error)
      return errorHandler(error)
    }
  }

  async remove ({ resource_id }) {
    try {
      const response = await this.http.delete(`/${resource_id}`)
      const payload = {
        status: 200,
        message: `Deleted resource with id ${resource_id}`,
        data: response.data
      }
      return payload
    } catch (error) {
      console.log(error)
      return errorHandler(error)
    }
  }

}

module.exports = Resource
