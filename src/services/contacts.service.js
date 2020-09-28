import {
  getOneWithDetails,
  createRecord,
  updateRecord,
  deleteRecord,
  getAllWithDetails,
  getSummaryTotals,
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
    pick([
      ...fieldsDetailsContact,
      'namePublisher',
      'idDetail',
      'createdByName',
      'updatedByName'
    ]),
    omit(['phoneContact'])
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
        phone === current.phone && !isNull(current.idDetail)
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
    const withoutDetails = getOr(0, 'null', countBy('idDetail', uniqueContacts))
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
    map(async phoneContact =>
      createRecordDetailsContact({
        information: WAITING_FEEDBACK,
        idPublisher: getLodash('idPublisher', data),
        createdBy: getLodash('createdBy', data),
        phoneContact
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
    map(async phoneContact =>
      deleteRecordsDetailsContact({
        phoneContact,
        idPublisher: getLodash('idPublisher', data),
        information: WAITING_FEEDBACK
      })
    )(getLodash('phones', data))
  )

const getSummaryContacts = async user => {
  const totals = await getSummaryTotals(getLodash('id', user))
  const totalContacts = Number(totals.totalContacts.count)
  const totalContactsContacted = Number(totals.totalContactsContacted.count)
  const totalContactsWithoutContact = totalContacts - totalContactsContacted
  const totalPercentContacted = Math.round(
    (totalContactsContacted / totalContacts) * 100
  )
  const totalPercentWithoutContacted = 100 - totalPercentContacted

  const totalContactsAssignByMeWaitingFeedback = Number(
    totals.totalContactsAssignByMeWaitingFeedback.count
  )
  const totalContactsWaitingFeedback = Number(
    totals.totalContactsWaitingFeedback.count
  )

  const totalPercentContactsWaitingFeedback = Math.round(
    (totalContactsWaitingFeedback / totalContacts) * 100
  )

  const totalPercentContactsAssignByMeWaitingFeedback = Math.round(
    (totalContactsAssignByMeWaitingFeedback / totalContactsWaitingFeedback) *
      100
  )

  const totalPercentContactsAssignByOthersWaitingFeedback =
    100 - totalPercentContactsAssignByMeWaitingFeedback

  const calculatePercentage = count =>
    Math.round((totalContactsContacted / count) * 100)

  const totalsContactsWaitingFeedbackByPublisher = map(
    publisher => ({
      ...publisher,
      percent: calculatePercentage(publisher.count)
    }),
    totals.totalsContactsWaitingFeedbackByPublisher
  )

  return {
    totalContacts,
    totalContactsContacted,
    totalContactsWithoutContact,
    totalPercentContacted,
    totalPercentWithoutContacted,
    totalPercentContactsWaitingFeedback,
    totalContactsWaitingFeedback,
    totalContactsAssignByMeWaitingFeedback,
    totalPercentContactsAssignByMeWaitingFeedback,
    totalsContactsWaitingFeedbackByPublisher,
    totalPercentContactsAssignByOthersWaitingFeedback
  }
}

export default {
  get,
  getOne,
  create,
  update,
  deleteOne,
  assign,
  cancelAssign,
  getSummaryContacts
}
