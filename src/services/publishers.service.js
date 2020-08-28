const {
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../models/publishersModel')
import { responseSuccess } from '../shared/helpers/responseGeneric'
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForDelete,
  defaultValueForQuery
} from '../shared/helpers/genericHelpers'
import asyncPipe from 'pipeawait'
import { curry } from 'lodash/fp'

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

export default { get, getOne, create, update, deleteOne }
