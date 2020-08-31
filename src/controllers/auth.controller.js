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
import simpleLog from 'simple-node-logger'

const authenticate = async (req, res, next) => {
  try {
    const log = simpleLog.createSimpleLogger('authenticate.log')
    const { email, password } = req.body
    const publisher = await getRecordForAuth(email, 'email')
    const encryptPassword = encrypt(password)
    if (!publisher) {
      log.info(
        NO_EMAIL_VALID,
        ' : ',
        email,
        ' at ',
        new Date().toJSON(),
        ' request headers: ',
        req.headers
      )
      return next(
        responseError({
          cod: NO_EMAIL_VALID,
          error: NO_EMAIL_VALID,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }
    if (getOr('', 'password', publisher) !== encryptPassword) {
      log.info(
        PASSWORD_WRONG,
        ' : ',
        password,
        ' email: ',
        email,
        ' at ',
        new Date().toJSON(),
        ' request headers: ',
        req.headers
      )
      return next(
        responseError({
          cod: PASSWORD_WRONG,
          error: PASSWORD_WRONG,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }

    if (!getOr(false, 'active', publisher)) {
      log.info(
        NOT_ACTIVE,
        ' : ',
        email,
        ' at ',
        new Date().toJSON(),
        ' request headers: ',
        req.headers
      )
      return next(
        responseError({
          cod: NOT_ACTIVE,
          error: NOT_ACTIVE,
          httpErrorCode: HttpStatus.UNAUTHORIZED
        })
      )
    }

    res.json(jwtSignIn(publisher))
  } catch (error) {
    next(responseNext(error, req))
  }
}

const jwtSignIn = publisher => {
  const jwtToken = createJwtToken({
    email: get('email', publisher),
    id: get('id', publisher),
    // eslint-disable-next-line @typescript-eslint/camelcase
    id_responsibility: get('id_responsibility', publisher)
  })
  const publisherDataPublic = omit(omitColumns, publisher)
  return {
    status: true,
    cod: AUTHORIZED,
    data: {
      ...publisherDataPublic,
      jwtToken
    }
  }
}

export default { authenticate, jwtSignIn }
