import { responseNext, responseError } from '../helpers/responseGeneric'
import { getRecordForAuth } from '../models/publishersModel'
import {
  NO_EMAIL_VALID,
  PASSWORD_WRONG,
  NOT_ACTIVE
} from '../constants/publishers'
import { AUTHORIZED } from '../constants/security'
import { getOr, get } from 'lodash/fp'
import { createJwtToken, encrypt } from '../helpers/genericHelpers'

const authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const publisher = await getRecordForAuth(email, 'email')
    const encryptPassword = encrypt(password)

    if (!publisher) {
      next(responseError({ cod: NO_EMAIL_VALID, error: NO_EMAIL_VALID }))
    }

    if (getOr('', 'password', publisher) !== encryptPassword) {
      next(responseError({ cod: PASSWORD_WRONG, error: PASSWORD_WRONG }))
    }

    if (!getOr(false, 'active', publisher)) {
      next(responseError({ cod: NOT_ACTIVE, error: NOT_ACTIVE }))
    }

    const jwtToken = createJwtToken({ email, id: get('id', publisher) })
    const responseSuccess = {
      status: true,
      cod: AUTHORIZED,
      data: {
        ...publisher,
        jwtToken
      }
    }

    res.json(responseSuccess)
  } catch (error) {
    next(responseNext(error, req))
  }
}

export default { authenticate }
