import { responseError } from './responseGeneric'

const errorHandler = (err, req, res, next) => {
  if (!err) return next()
  res.status(500).json(responseError(err))
}

export default errorHandler
