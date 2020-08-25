const {
  getAll,
  createRecord,
  updateRecord,
  deleteRecord
} = require('../models/statusModel')
import {
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery
} from '../helpers/genericHelpers'
import { responseSuccess, responseNext } from '../helpers/responseGeneric'
import asyncPipe from 'pipeawait'
import { curry } from 'lodash/fp'

const get = async (request, response, next) => {
  try {
    const paramsQuery = defaultValueForQuery(request, {
      sort: 'description:asc'
    })
    response.json(
      await asyncPipe(getAll, curry(responseSuccess)(request))(paramsQuery)
    )
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(
      await asyncPipe(
        createRecord,
        curry(responseSuccess)(request)
      )(getParamsForCreate(request))
    )
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(
      await asyncPipe(
        updateRecord,
        curry(responseSuccess)(request)
      )(getParamsForUpdate(request))
    )
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(
      await asyncPipe(
        deleteRecord,
        curry(responseSuccess)(request)
      )(getParamsForDelete(request))
    )
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default { get, create, update, deleteOne }
