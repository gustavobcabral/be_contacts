const {
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  omitColumns
} = require('../models/publishers.model')
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForDelete,
  defaultValueForQuery
} from '../shared/helpers/generic.helper'
import asyncPipe from 'pipeawait'
import { curry, get as getLodash, omit, toInteger } from 'lodash/fp'
import {
  NOT_ALLOWED_DELETE_ADMIN,
  NOT_ALLOWED_GET_DATA_MORE_RESPONSIBILITY
} from '../shared/constants/security.constant'
import { encrypt } from '../shared/helpers/generic.helper'
import HttpStatus from 'http-status-codes'

import {
  ID_ADMIN,
  ERROR_PASSWORD_LOWERCASE_LETTER,
  ERROR_PASSWORD_UPPERCASE_LETTER,
  ERROR_PASSWORD_NUMBER,
  ERROR_PASSWORD_SPECIAL_CHARACTER,
  ERROR_PASSWORD_MINIMUM_LENGTH,
  ERROR_PASSWORD_SPACE
} from '../shared/constants/publishers.constant'

const get = async request => {
  const paramsQuery = {
    ...defaultValueForQuery(request, {
      sort: 'name:asc'
    }),
    user: getLodash('user', request)
  }
  return asyncPipe(getAll, curry(responseSuccess)(request))(paramsQuery)
}

const verifyIfCurrentUserCanSeeThisData = async ({
  data,
  idResponsibility
}) => {
  if (toInteger(idResponsibility) < getLodash('idResponsibility', data))
    throw NOT_ALLOWED_GET_DATA_MORE_RESPONSIBILITY

  return data
}

const prepareDataToVerification = (request, data) => ({
  data,
  idResponsibility: getLodash('user.idResponsibility', request)
})

const getOne = async request =>
  asyncPipe(
    getOneRecord,
    curry(prepareDataToVerification)(request),
    verifyIfCurrentUserCanSeeThisData,
    omit(omitColumns),
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))

const create = async request =>
  asyncPipe(
    validatePassword,
    encryptPassword,
    createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const verifyWhatCanUpdate = obj =>
  toInteger(getLodash('id', obj)) === ID_ADMIN
    ? {
        ...obj,
        data: omit(['idResponsibility'], getLodash('data', obj))
      }
    : obj

const setValueReAuthenticate = async (id, value) =>
  Boolean(await updateRecord({ id, data: { haveToReauthenticate: value } }))

const reBuildObjectDataToReauthenticate = obj => ({
  id: getLodash('id', obj),
  data: {
    ...getLodash('data', obj),
    haveToReauthenticate: true
  }
})

const verifyIfIsNecessaryReAuthenticate = async obj =>
  getLodash('data.idResponsibility', obj) &&
  toInteger(getLodash('data.idResponsibility', obj)) !==
    toInteger(
      getLodash('idResponsibility', await getOneRecord(getLodash('id', obj)))
    )
    ? reBuildObjectDataToReauthenticate(obj)
    : obj

const update = async request =>
  asyncPipe(
    verifyWhatCanUpdate,
    verifyIfIsNecessaryReAuthenticate,
    validatePassword,
    encryptPassword,
    updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))

const verifyIfCanDelete = id => {
  if (toInteger(id) === ID_ADMIN) {
    throw NOT_ALLOWED_DELETE_ADMIN
  }
  return id
}

const deleteOne = async request =>
  asyncPipe(
    verifyIfCanDelete,
    deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

const encryptPassword = data =>
  getLodash('password', data)
    ? {
        ...data,
        password: encrypt(getLodash('password', data))
      }
    : data

const validatePassword = data => {
  const password = getLodash('password', data)

  const passwordRequirements = [
    {
      regex: /.{8,}/, //  deve ter pelo menos 8 chars,
      message: ERROR_PASSWORD_MINIMUM_LENGTH
    },
    {
      regex: /[a-z]/, // deve ter pelo menos uma letra minuscula
      message: ERROR_PASSWORD_LOWERCASE_LETTER
    },
    {
      regex: /[A-Z]/, // deve ter pelo menos uma letra maiuscula
      message: ERROR_PASSWORD_UPPERCASE_LETTER
    },
    {
      regex: /[0-9]/, // deve ter pelo menos um numero
      message: ERROR_PASSWORD_NUMBER
    },
    {
      regex: /[^A-Za-z0-9]/, // deve ter pelo menos um caractere especial
      message: ERROR_PASSWORD_SPECIAL_CHARACTER
    },
    {
      regex: /^\S*$/, // must not contain spaces
      message: ERROR_PASSWORD_SPACE
    }
  ]
  password &&
    passwordRequirements.forEach(it => {
      if (!it.regex.test(String(password))) {
        throw {
          httpErrorCode: HttpStatus.BAD_REQUEST,
          error: it.message
        }
      }
    })

  return data
}

export default {
  get,
  getOne,
  create,
  update,
  deleteOne,
  setValueReAuthenticate
}
