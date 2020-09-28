const {
  getDetailsAllContact,
  getDetailsOneContact,
  createRecord,
  updateRecord,
  deleteRecord,
  getOne
} = require('../models/detailsContacts.model')
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import {
  getParamsForGetOne,
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery
} from '../shared/helpers/generic.helper'
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
const getAllDetailsOneContact = async request => {
  return asyncPipe(
    getDetailsOneContact,
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))
}
const getOneDetail = async request => {
  return asyncPipe(
    getOne,
    curry(responseSuccess)(request)
  )(getParamsForGetOne(request))
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

export default {
  get,
  create,
  update,
  deleteOne,
  getAllDetailsOneContact,
  getOneDetail
}
