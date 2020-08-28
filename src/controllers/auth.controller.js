import HttpStatus from 'http-status-codes'
import {
  responseNext,
  responseError
} from '../shared/helpers/responseGeneric.helper'
import { getRecordForAuth, omitColumns } from '../models/publishers.model'
import {
  NO_EMAIL_VALID,
  PASSWORD_WRONG,
  NOT_ACTIVE
} from '../shared/constants/publishers.constant'
import { AUTHORIZED } from '../shared/constants/security.constant'
import { getOr, get, omit } from 'lodash/fp'
import { createJwtToken, encrypt } from '../shared/helpers/generic.helper'

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

    const jwtToken = createJwtToken({
      email,
      id: get('id', publisher),
      // eslint-disable-next-line @typescript-eslint/camelcase
      id_responsibility: get('id_responsibility', publisher)
    })
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