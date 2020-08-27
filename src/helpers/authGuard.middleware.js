import jwt from 'jsonwebtoken'
import HttpStatus from 'http-status-codes'
import { responseError } from './responseGeneric'
import { UNAUTHORIZED, NO_TOKEN, JWT_SECRET } from '../constants/security'

const authGuard = (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      return next(
        responseError({
          cod: NO_TOKEN,
          message: NO_TOKEN,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }

    jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET || JWT_SECRET
    )

    return next()
  } catch (error) {
    next(
      responseError({
        cod: UNAUTHORIZED,
        httpErrorCode: HttpStatus.UNAUTHORIZED,
        message: error
      })
    )
  }
}

export default authGuard
