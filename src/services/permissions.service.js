/* eslint-disable @typescript-eslint/camelcase */
import {
  getUserPermission,
  getAll,
  createRecord,
  updateRecord,
  deleteRecord
} from '../models/permissions.model'
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery
} from '../shared/helpers/generic.helper'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import asyncPipe from 'pipeawait'
import { curry } from 'lodash/fp'

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

const update = async request =>
  asyncPipe(
    updateRecord,
    curry(responseSuccess)(request)
  )(getParamsForUpdate(request))

const deleteOne = async request =>
  asyncPipe(
    deleteRecord,
    curry(responseSuccess)(request)
  )(getParamsForDelete(request))

export default { hasPermission, get, create, update, deleteOne }
