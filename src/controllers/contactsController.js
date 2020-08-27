import {
  getOneWithDetails,
  createRecord,
  updateRecord,
  deleteRecord,
  getAllWithDetails,
  columnPrimary,
  fields
} from '../models/contactsModel'
import { fields as fieldsDetailsContact } from '../models/detailsContactsModel'
import asyncPipe from 'pipeawait'
import {
  first,
  isEmpty,
  reduce,
  pipe,
  pick,
  isNull,
  curry,
  uniqBy,
  map,
  get as getLodash,
  getOr,
  omit,
  orderBy,
  countBy
} from 'lodash/fp'
import { responseSuccess, responseNext } from '../helpers/responseGeneric'
import {
  getParamsForUpdate,
  getParamsForGet,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForDelete
} from '../helpers/genericHelpers'

const getDetailsProps = detailsContact => {
  return omit(['phone_contact'], pick(fieldsDetailsContact, detailsContact))
}

const getContactProps = contact => {
  return pick(fields, contact)
}

const reduceToGetDetails = (phone, listAllDetails) => {
  return pipe(
    orderBy(['createdAt'], ['desc']),
    reduce(
      (acc, current) =>
        phone === current.phone && !isNull(current.createdAt)
          ? [...acc, getDetailsProps(current)]
          : acc,
      []
    )
  )(listAllDetails)
}

const mapToGetDetailsOneContact = (list, contactsUnique) => {
  return map(
    contact => ({
      ...getContactProps(contact),
      details: reduceToGetDetails(getLodash(columnPrimary, contact), list)
    }),
    contactsUnique
  )
}

const mountDetailsDataForContacts = detailsContacts => {
  if (!isEmpty(detailsContacts)) {
    const list = getOr([detailsContacts], 'list', detailsContacts)
    const uniqueContacts = uniqBy(columnPrimary, list)
    const withoutDetails = getOr(
      0,
      'null',
      countBy('phone_contact', uniqueContacts)
    )
    const withDetails = uniqueContacts.length - withoutDetails
    const listOrganized = mapToGetDetailsOneContact(list, uniqueContacts)
    return {
      ...detailsContacts,
      withDetails,
      withoutDetails,
      list: listOrganized
    }
  }
  return []
}

const mountDetailsDataForOneContact = detailsContact => {
  const contact = first(detailsContact)
  return {
    ...getContactProps(contact),
    details: reduceToGetDetails(
      getLodash(columnPrimary, contact),
      detailsContact
    )
  }
}

const get = async (request, response, next) => {
  try {
    response.json(
      await asyncPipe(
        getAllWithDetails,
        mountDetailsDataForContacts,
        curry(responseSuccess)(request)
      )(getParamsForGet(request))
    )
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getOne = async (request, response, next) => {
  try {
    response.json(
      await asyncPipe(
        getOneWithDetails,
        mountDetailsDataForOneContact,
        curry(responseSuccess)(request)
      )(getParamsForGetOne(request))
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

export default { get, getOne, create, update, deleteOne }
