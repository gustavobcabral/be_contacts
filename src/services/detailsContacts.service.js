import {
  getDetailsAllContact,
  getDetailsOneContact,
  createRecord,
  updateRecord,
  deleteRecord,
  getOne
} from '../models/detailsContacts.model'
import { updateRecord as updateRecordContacts } from '../models/contacts.model'
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import {
  getParamsForGetOne,
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForDelete,
  defaultValueForQuery
} from '../shared/helpers/generic.helper'
import asyncPipe from 'pipeawait'
import { curry, get as getLodash } from 'lodash/fp'

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

const create = async request => {
  const data = getParamsForCreate(request)
  const dataDetailsContact = {
    ...getLodash('detailsContact', data),
    createdBy: getLodash('createdBy', data)
  }

  const dataContact = {
    data: {
      ...getLodash('contact', data),
      updatedBy: getLodash('user.id', request)
    },
    id: getLodash('contact.phone', data)
  }

  const resContacts = await updateRecordContacts(dataContact)
  return {
    contacts: resContacts,
    detailsContact: await asyncPipe(
      createRecord,
      curry(responseSuccess)(request)
    )(dataDetailsContact)
  }
}

const update = async request => {
  const data = getParamsForUpdate(request)
  const dataDetailsContact = {
    data: {
      ...getLodash('data.detailsContact', data),
      updatedBy: getLodash('user.id', request)
    },
    id: getLodash('id', data)
  }
  const dataContact = {
    data: {
      ...getLodash('data.contact', data),
      updatedBy: getLodash('user.id', request)
    },
    id: getLodash('data.contact.phone', data)
  }

  const resContacts = await updateRecordContacts(dataContact)
  return {
    contacts: resContacts,
    detailsContact: await asyncPipe(
      updateRecord,
      curry(responseSuccess)(request)
    )(dataDetailsContact)
  }
}

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
