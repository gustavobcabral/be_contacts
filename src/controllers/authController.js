import {
  responseNext,
  responseSuccess,
  responseError
} from '../helpers/responseGeneric'
import crud from '../models/crudGeneric'
import {
  NO_EMAIL_VALID,
  PASSWORD_WRONG,
  NOT_ACTIVE
} from '../constants/publishers'
import { omit, getOr } from 'lodash/fp'
import { createJwtToken, encrypt } from '../helpers/genericHelpers'

async function authenticate(req, res, next) {
  try {
    const { email, password } = req.params
    const publisher = await crud.getOneRecord({
      id: email,
      tableName: 'contacts',
      columnPrimary: 'email'
    })
    if (!publisher) {
      next(responseError({ cod: NO_EMAIL_VALID, error: NO_EMAIL_VALID }))
    }
    if (!getOr(false, 'active', publisher)) {
      next(responseError({ cod: NOT_ACTIVE, error: NOT_ACTIVE }))
    }

    const encryptPassword = encrypt(password)
    const passwordValid = await crud.getOneRecord({
      id: encryptPassword,
      tableName: 'contacts',
      columnPrimary: 'password'
    })
    if (!passwordValid) {
      next(responseError({ cod: PASSWORD_WRONG, error: PASSWORD_WRONG }))
    }
    const userData = omit(['password'], passwordValid)
    const token = createJwtToken({ email, id: passwordValid.id })
    const data = {
      ...userData,
      token
    }
    res.json(responseSuccess(req, data))
  } catch (error) {
    next(responseNext(error, req))
  }
}

export default { authenticate }
