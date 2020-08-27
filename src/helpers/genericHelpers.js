import { get } from 'lodash/fp'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constants/security'
import crypto from 'crypto'

const getParamsForUpdate = request => ({
  data: get('body', request),
  id: get('params.id', request)
})

const getParamsForGet = request => get('query', request)
const getParamsForCreate = request => get('body', request)
const getParamsForGetOne = request => get('params.id', request)
const getParamsForDelete = request => getParamsForGetOne(request)

const defaultValueForQuery = (request, objectDefault) => {
  return { ...objectDefault, ...getParamsForGet(request) }
}
const createJwtToken = param =>
  jwt.sign(param, process.env.JWT_KEY || JWT_SECRET)

const encrypt = password => crypto.createHmac('sha256', password).digest('hex')

export {
  getParamsForGet,
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForDelete,
  defaultValueForQuery,
  createJwtToken,
  encrypt
}
