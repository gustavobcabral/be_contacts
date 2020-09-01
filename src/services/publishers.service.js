const {
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord
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
import { NOT_ALLOWED_DELETE_ADMIN } from '../shared/constants/security.constant'
import { ID_ADMIN } from '../shared/constants/publishers.constant'

const get = async request => {
  const paramsQuery = defaultValueForQuery(request, {
    sort: 'name:asc'
  })
  return asyncPipe(getAll, curry(responseSuccess)(request))(paramsQuery)
}

const getOne = async request =>
  asyncPipe(
    getOneRecord,
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))

const create = async request =>
  asyncPipe(
    createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const verifyWhatCanUpdate = obj =>
  toInteger(getLodash('id', obj)) === ID_ADMIN
    ? {
        ...obj,
        data: omit(['id_responsibility'], getLodash('data', obj))
      }
    : obj

const setValueReAuthenticate = async (id, value) =>
  // eslint-disable-next-line @typescript-eslint/camelcase
  Boolean(await updateRecord({ id, data: { have_to_reauthenticate: value } }))

const reBuildObjectDataToReauthenticate = obj => ({
  id: getLodash('id', obj),
  data: {
    ...getLodash('data', obj),
    // eslint-disable-next-line @typescript-eslint/camelcase
    have_to_reauthenticate: true
  }
})

const verifyIfIsNecessaryReAuthenticate = async obj =>
  getLodash('data.id_responsibility', obj) &&
  toInteger(getLodash('data.id_responsibility', obj)) !==
    toInteger(
      getLodash('id_responsibility', await getOneRecord(getLodash('id', obj)))
    )
    ? reBuildObjectDataToReauthenticate(obj)
    : obj

const update = async request =>
  asyncPipe(
    verifyWhatCanUpdate,
    verifyIfIsNecessaryReAuthenticate,
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

export default {
  get,
  getOne,
  create,
  update,
  deleteOne,
  setValueReAuthenticate
}
