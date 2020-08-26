import { responseError } from './responseGeneric'
import HttpStatus from 'http-status-codes'

const errorHandler = (err, req, res, next) => {
  if (!err) return next()
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseError(err))
}

export default errorHandler
