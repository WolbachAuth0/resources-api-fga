const responseFormatter = require('./responseFormatter')

module.exports = function (err, req, res, next) {
  let payload = {
    status: err.status || err.statusCode || 500,
    message: err.message,
    data: {}
  }
  if (payload.status == 401 || payload.status == 400) {
    payload.data = err.stack.split('\n')[0] || []
  } else if (err.stack) {
    payload.data = err.stack.split('\n') || []
  } else {
    payload.data = []
  }

  const json = responseFormatter(req, res, payload)
  res.status(payload.status).json(json)
}