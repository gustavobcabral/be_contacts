import {
  getOneWithDetails,
  createRecord,
  updateRecord,
  deleteRecord,
  getAll,
  getSummaryTotals,
  columnPrimary,
  fields,
  getAllWaitingFeedback
} from '../models/contacts.model'
import {
  fields as fieldsDetailsContact,
  createRecord as createRecordDetailsContact,
  deleteRecords as deleteRecordsDetailsContact
} from '../models/detailsContacts.model'
import asyncPipe from 'pipeawait'
import {
  first,
  reduce,
  pipe,
  pick,
  isNull,
  curry,
  map,
  get as getLodash,
  omit,
  orderBy
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
  asyncPipe(getAll, curry(responseSuccess)(request))(getParamsForGet(request))

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

  const totalPercentContactsAssignByMeWaitingFeedback =
    totalContactsWaitingFeedback > 0
      ? Math.round(
          (totalContactsAssignByMeWaitingFeedback /
            totalContactsWaitingFeedback) *
            100
        )
      : 0

  const totalPercentContactsAssignByOthersWaitingFeedback =
    totalContactsWaitingFeedback > 0
      ? 100 - totalPercentContactsAssignByMeWaitingFeedback
      : 0

  const calculatePercentage = count =>
    Math.round((count / totalContactsWaitingFeedback) * 100)

  const totalsContactsWaitingFeedbackByPublisher = map(
    publisher => ({
      ...publisher,
      percent: calculatePercentage(publisher.count)
    }),
    totals.totalsContactsWaitingFeedbackByPublisher
  )

  const totalContactsByGender = totals.totalContactsByGender

  const calculatePercentageByGender = count =>
    Math.round((count / totalContactsContacted) * 100)

  const totalContactsByGenderContacted = map(
    gender => ({
      ...gender,
      percent: calculatePercentageByGender(gender.count)
    }),
    totals.totalContactsByGenderContacted
  )

  const totalContactsByLanguage = totals.totalContactsByLanguage

  const calculatePercentageByLanguage = count =>
    Math.round((count / totalContactsContacted) * 100)

  const totalContactsByLanguageContacted = map(
    language => ({
      ...language,
      percent: calculatePercentageByLanguage(language.count)
    }),
    totals.totalContactsByLanguageContacted
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
    totalPercentContactsAssignByOthersWaitingFeedback,
    totalContactsByGender,
    totalContactsByGenderContacted,
    totalContactsByLanguage,
    totalContactsByLanguageContacted
  }
}

const getAllContactsWaitingFeedback = async request =>
  asyncPipe(
    getAllWaitingFeedback,
    curry(responseSuccess)(request)
  )(getParamsForCreate(request))

export default {
  get,
  getOne,
  create,
  update,
  deleteOne,
  assign,
  cancelAssign,
  getSummaryContacts,
  getAllContactsWaitingFeedback
}
