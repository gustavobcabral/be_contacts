import knex from '../database/connection'
import crud from './crudGeneric.model'
import { isNil, isEmpty } from 'lodash/fp'
import { WAITING_FEEDBACK } from '../shared/constants/contacts.constant'

const tableName = 'detailsContacts'
const columnPrimary = 'id'
const fields = [
  'createdAt',
  'information',
  'idPublisher',
  'phoneContact',
  'createdBy',
  'updatedBy'
]

const getDetailsOneContact = async ({ id, query }) => {
  const limit = query.limit || 5
  const sql = knex
    .select(
      'detailsContacts.information',
      'detailsContacts.createdAt',
      'detailsContacts.idPublisher',
      'detailsContacts.id',
      'contacts.name',
      'contacts.idLanguage',
      'contacts.gender',
      'publishers.name as publisherName'
    )
    .from(tableName)
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('phoneContact', '=', id)
    .orderBy('createdAt', 'desc')

  if (!isNil(limit) && limit > 0) sql.limit(limit)
  return sql
}

const getDetailsIsWaitingFeedbackOneContact = async phoneContact => {
  return knex
    .select('detailsContacts.id')
    .from(tableName)
    .where('phoneContact', '=', phoneContact)
    .where('information', WAITING_FEEDBACK)
}

const getOne = async id =>
  knex
    .select(
      'detailsContacts.*',
      'publishers.name as publisherName',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.name',
      'contacts.gender'
    )
    .from(tableName)
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')

    .where('detailsContacts.id', id)
    .first()

const getDetailsAllContact = async () =>
  knex
    .select()
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')

const getDetailsAllContactWaitingFeedback = async queryParams => {
  const { sort, perPage, currentPage, filters } = queryParams

  const sql = knex
    .select(
      'detailsContacts.id',
      'detailsContacts.information',
      'detailsContacts.createdAt',
      'detailsContacts.idPublisher',
      'publishers.name as publisherName',
      'languages.name as languageName',
      'status.description as statusDescription',
      'contacts.name as contactName',
      'contacts.gender',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.phone',
      knex.raw('true as "waitingFeedback"')
    )
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .where('detailsContacts.information', WAITING_FEEDBACK)

  if (!isEmpty(filters)) {
    const { name, phone, genders, languages, status } = JSON.parse(filters)

    if (!isEmpty(name) && !isEmpty(phone)) {
      sql.where(builder =>
        builder
          .where('contacts.name', 'ilike', `%${name}%`)
          .orWhere('contacts.phone', 'ilike', `%${phone}%`)
      )
    }
    if (!isEmpty(genders))
      sql.andWhere(qB => qB.whereIn('contacts.gender', genders))

    if (!isEmpty(languages))
      sql.andWhere(qB => qB.whereIn('contacts.idLanguage', languages))

    if (!isEmpty(status))
      sql.andWhere(qB => qB.whereIn('contacts.idStatus', status))
  }
  return sql.orderByRaw(crud.parseOrderBy(sort)).paginate(perPage, currentPage)
}

const getGenders = async () =>
  knex
    .select('gender')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('gender')

const getLanguages = async () =>
  knex
    .select('idLanguage', 'languages.name as languageName')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('idLanguage', 'languages.name')

const getStatus = async () =>
  knex
    .select('idStatus', 'status.description as statusDescription')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('idStatus', 'status.description')

const getFiltersWaitingFeedback = async () => {
  const genders = await getGenders()
  const languages = await getLanguages()
  const status = await getStatus()
  return { genders, languages, status }
}

const createRecord = async data => crud.createRecord(data, tableName)

const updateRecord = async ({ id, data }) =>
  crud.updateRecord({ id, data, tableName, columnPrimary })

const updateRecords = async ({ where, data }) =>
  crud.updateRecords({ data, tableName, where })

const deleteRecord = async id =>
  crud.deleteRecord({ id, tableName, columnPrimary })

const deleteRecords = async where => crud.deleteRecords({ where, tableName })

const deleteRecordByPhone = phone =>
  knex(tableName)
    .where('phoneContact', '=', phone)
    .delete()

export {
  getOne,
  getDetailsAllContactWaitingFeedback,
  getFiltersWaitingFeedback,
  getDetailsOneContact,
  getDetailsAllContact,
  getDetailsIsWaitingFeedbackOneContact,
  createRecord,
  updateRecord,
  updateRecords,
  deleteRecord,
  deleteRecords,
  deleteRecordByPhone,
  columnPrimary,
  fields
}
