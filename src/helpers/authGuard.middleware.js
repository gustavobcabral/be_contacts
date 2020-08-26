import jwt from 'jsonwebtoken'
import { responseError } from './responseGeneric'
import { UNAUTHORIZED, NO_TOKEN, JWT_SECRET } from '../constants/security'

const authGuard = (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      return next(responseError({ cod: NO_TOKEN, message: NO_TOKEN }))
    }

    const jwtPayload = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET || JWT_SECRET
    )

    // eslint-disable-next-line fp/no-mutation
    req.user = jwtPayload
    return next()
  } catch (error) {
    next(
      responseError({
        cod: UNAUTHORIZED,
        message: error
      })
    )
  }
}

export default authGuard
