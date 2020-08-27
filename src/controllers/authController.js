import HttpStatus from 'http-status-codes'
import { responseNext, responseError } from '../helpers/responseGeneric'
import { getRecordForAuth, omitColumns } from '../models/publishersModel'
import {
  NO_EMAIL_VALID,
  PASSWORD_WRONG,
  NOT_ACTIVE
} from '../constants/publishers'
import { AUTHORIZED } from '../constants/security'
import { getOr, get, omit } from 'lodash/fp'
import { createJwtToken, encrypt } from '../helpers/genericHelpers'

const authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const publisher = await getRecordForAuth(email, 'email')
    const encryptPassword = encrypt(password)

    if (!publisher) {
      return next(
        responseError({
          cod: NO_EMAIL_VALID,
          error: NO_EMAIL_VALID,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }
    if (getOr('', 'password', publisher) !== encryptPassword) {
      return next(
        responseError({
          cod: PASSWORD_WRONG,
          error: PASSWORD_WRONG,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }

    if (!getOr(false, 'active', publisher)) {
      return next(
        responseError({
          cod: NOT_ACTIVE,
          error: NOT_ACTIVE,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }

    const jwtToken = createJwtToken({ email, id: get('id', publisher) })
    const publisherDataPublic = omit(omitColumns, publisher)
    const responseSuccess = {
      status: true,
      cod: AUTHORIZED,
      data: {
        ...publisherDataPublic,
        jwtToken
      }
    }

    res.json(responseSuccess)
  } catch (error) {
    next(responseNext(error, req))
  }
}

export default { authenticate }
