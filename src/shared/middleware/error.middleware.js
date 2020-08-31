import { responseError } from '../helpers/responseGeneric.helper'
import HttpStatus from 'http-status-codes'
import simpleLog from 'simple-node-logger'

const errorHandler = (err, req, res, next) => {
  if (!err) return next()
  const log = simpleLog.createSimpleLogger('errorHandler.log')
  const codStatus = err.httpErrorCode
    ? err.httpErrorCode
    : HttpStatus.INTERNAL_SERVER_ERROR
  log.error(
    'error on url: ',
    req.baseUrl,
    ' error: ',
    err,
    ' at ',
    new Date().toJSON(),
    ' request headers: ',
    req.headers
  )

  res.status(codStatus).json(responseError(err))
}

export default errorHandler
