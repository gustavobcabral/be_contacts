import knex from '../config/connection'
import crud from './crudGeneric.model'
import { isNil, isEmpty } from 'lodash/fp'
import { WAITING_FEEDBACK } from '../shared/constants/contacts.constant'
import { ELDER } from '../shared/constants/permissions.constant'

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

const getDetailsAllContactWaitingFeedback = async ({ query, user }) => {
  const { sort, perPage, currentPage, filters } = query
  const { idResponsibility } = user
  const sql = knex
    .select(
      'detailsContacts.id',
      'detailsContacts.information',
      'detailsContacts.createdAt',
      'detailsContacts.createdBy',
      'detailsContacts.idPublisher',
      'publisherCreatedBy.name as publisherNameCreatedBy',
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
    .leftJoin(
      'publishers as publisherCreatedBy',
      'detailsContacts.createdBy',
      '=',
      'publisherCreatedBy.id'
    )
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .where('detailsContacts.information', WAITING_FEEDBACK)

  if (idResponsibility < ELDER) {
    sql
      .where('detailsContacts.createdBy', user.id)
      .orWhere('detailsContacts.idPublisher', user.id)
  }

  if (!isEmpty(filters)) {
    const {
      name,
      phone,
      responsible,
      creator,
      genders,
      languages,
      status
    } = JSON.parse(filters)

    if (!isEmpty(name) && !isEmpty(phone) && !isEmpty(responsible)) {
      sql.where(builder =>
        builder
          .where('contacts.name', 'ilike', `%${name}%`)
          .orWhere('contacts.phone', 'ilike', `%${phone}%`)
          .orWhere('publishers.name', 'ilike', `%${responsible}%`)
          .orWhere('publisherCreatedBy.name', 'ilike', `%${creator}%`)
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
