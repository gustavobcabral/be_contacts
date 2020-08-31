/* eslint-disable @typescript-eslint/camelcase */
import {
  getUserPermission,
  getOneWithWhere,
  getAll,
  createRecord,
  updateRecord,
  deleteRecord,
  putFields
} from '../models/permissions.model'
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery
} from '../shared/helpers/generic.helper'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import asyncPipe from 'pipeawait'
import { curry, get as getLodash, pick } from 'lodash/fp'
import { NOT_ALLOWED_DELETE } from '../shared/constants/permissions.constant'

const hasPermission = async (userIdResponsibility, page, method) => {
  const { id_minimum_responsibility_required } = await getUserPermission(
    page,
    method
  )
  return userIdResponsibility >= id_minimum_responsibility_required
}

const get = async request => {
  const paramsQuery = defaultValueForQuery(request, {
    sort: 'page:asc'
  })
  return asyncPipe(getAll, curry(responseSuccess)(request))(paramsQuery)
}

const create = async request =>
  asyncPipe(
    createRecord,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const filterWhatCanUpdate = obj => ({
  ...obj,
  data: pick(putFields, getLodash('data', obj))
})

const update = async request =>
  asyncPipe(
    filterWhatCanUpdate,
    updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))

const verifyIfCanDelete = async id => {
  const permissionWantDelete = await getOneWithWhere({ id })
  if (getLodash('page', permissionWantDelete) === 'permissions') {
    throw NOT_ALLOWED_DELETE
  }
  return id
}

const deleteOne = async request =>
  asyncPipe(
    verifyIfCanDelete,
    deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

export default { hasPermission, get, create, update, deleteOne }
