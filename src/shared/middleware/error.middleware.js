import { responseError } from '../helpers/responseGeneric.helper'
import HttpStatus from 'http-status-codes'

const errorHandler = (err, req, res, next) => {
  if (!err) return next()
  const codStatus = err.httpErrorCode
    ? err.httpErrorCode
    : HttpStatus.INTERNAL_SERVER_ERROR
  res.status(codStatus).json(responseError(err))
}

export default errorHandler
