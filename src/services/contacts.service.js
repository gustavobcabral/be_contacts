import {
  getOneWithDetails,
  createRecord,
  updateRecord,
  deleteRecord,
  getAllWithDetails,
  columnPrimary,
  fields
} from '../models/contacts.model'
import {
  fields as fieldsDetailsContact,
  createRecord as createRecordDetailsContact,
  deleteRecords as deleteRecordsDetailsContact
} from '../models/detailsContacts.model'
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
import { responseSuccess } from '../shared/helpers/responseGeneric.helper'
import { WAITING_FEEDBACK } from '../shared/constants/contacts.constant'
import {
  getParamsForUpdate,
  getParamsForGet,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForDelete
} from '../shared/helpers/generic.helper'

const getDetailsProps = detailsContact => {
  return pipe(
    pick([...fieldsDetailsContact, 'name_publisher', 'id_detail']),
    omit(['phone_contact'])
  )(detailsContact)
}

const getContactProps = contact => {
  return pick(fields, contact)
}

const reduceToGetDetails = (phone, listAllDetails) => {
  return pipe(
    orderBy(['createdAt'], ['desc']),
    reduce(
      (acc, current) =>
        phone === current.phone && !isNull(current.id_detail)
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
      countBy('id_detail', uniqueContacts)
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

const get = async request =>
  asyncPipe(
    getAllWithDetails,
    mountDetailsDataForContacts,
    curry(responseSuccess)(request)
  )(getParamsForGet(request))

const getOne = async request =>
  asyncPipe(
    getOneWithDetails,
    mountDetailsDataForOneContact,
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

const assign = async request =>
  asyncPipe(
    assignAllContactsToAPublisher,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const assignAllContactsToAPublisher = async data =>
  Promise.all(
    // eslint-disable-next-line @typescript-eslint/camelcase
    map(async phone_contact =>
      createRecordDetailsContact({
        information: WAITING_FEEDBACK,
        // eslint-disable-next-line @typescript-eslint/camelcase
        id_publisher: getLodash('id_publisher', data),
        // eslint-disable-next-line @typescript-eslint/camelcase
        phone_contact
      })
    )(getLodash('phones', data))
  )

const cancelAssign = async request =>
  asyncPipe(
    cancelAssignAllContactsToAPublisher,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

const cancelAssignAllContactsToAPublisher = async data =>
  Promise.all(
    // eslint-disable-next-line @typescript-eslint/camelcase
    map(async phone_contact =>
      deleteRecordsDetailsContact({
        // eslint-disable-next-line @typescript-eslint/camelcase
        phone_contact,
        // eslint-disable-next-line @typescript-eslint/camelcase
        id_publisher: getLodash('id_publisher', data),
        information: WAITING_FEEDBACK
      })
    )(getLodash('phones', data))
  )

export default { get, getOne, create, update, deleteOne, assign, cancelAssign }
