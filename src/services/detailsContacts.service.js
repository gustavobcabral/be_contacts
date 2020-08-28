const {
  getDetailsAllContact,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../models/detailsContactsModel')
import { responseSuccess } from '../shared/helpers/responseGeneric'
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery
} from '../shared/helpers/genericHelpers'
import asyncPipe from 'pipeawait'
import { curry } from 'lodash/fp'

const get = async request => {
  const paramsQuery = defaultValueForQuery(request, {
    sort: 'description:asc'
  })
  return asyncPipe(
    getDetailsAllContact,
    curry(responseSuccess)(request)
  )(paramsQuery)
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

export default { get, create, update, deleteOne }
