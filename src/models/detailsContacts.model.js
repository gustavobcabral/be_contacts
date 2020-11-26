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
  const { sort, perPage, currentPage, filters, limit } = query
  const sql = knex
    .select(
      'detailsContacts.information',
      knex.raw(
        `"detailsContacts"."information"='${WAITING_FEEDBACK}' as "waitingFeedback"`
      ),
      'detailsContacts.createdAt',
      'detailsContacts.idPublisher',
      'detailsContacts.id',
      'contacts.name',
      'contacts.owner',
      'contacts.idLanguage',
      'contacts.gender',
      'contacts.typeCompany',
      'publishers.name as publisherName'
    )
    .from(tableName)
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('phoneContact', '=', id)

  if (!isNil(limit) && limit > 0)
    return sql.limit(limit).orderByRaw(crud.parseOrderBy(sort))
  else if (!isEmpty(filters)) {
    const { publisher, details } = JSON.parse(filters)

    if (!isEmpty(publisher) && !isEmpty(details)) {
      sql.where(builder =>
        builder
          .where('detailsContacts.information', 'ilike', `%${details}%`)
          .orWhere('publishers.name', 'ilike', `%${publisher}%`)
      )
    }
    return sql
      .orderByRaw(crud.parseOrderBy(sort))
      .paginate(perPage, currentPage)
  }
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
      'contacts.owner',
      'contacts.gender',
      'contacts.typeCompany'
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
      'contacts.owner',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.phone',
      'contacts.typeCompany',
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
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }

  if (!isEmpty(filters)) {
    const {
      name,
      owner,
      phone,
      note,
      responsible,
      creator,
      genders,
      languages,
      status,
      typeCompany
    } = JSON.parse(filters)

    if (
      !isEmpty(name) &&
      !isEmpty(owner) &&
      !isEmpty(phone) &&
      !isEmpty(creator) &&
      !isEmpty(responsible) &&
      !isEmpty(note)
    ) {
      sql.where(builder =>
        builder
          .where('contacts.name', 'ilike', `%${name}%`)
          .orWhere('contacts.owner', 'ilike', `%${owner}%`)
          .orWhere('contacts.phone', 'ilike', `%${phone}%`)
          .orWhere('contacts.note', 'ilike', `%${note}%`)
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

    if (typeCompany !== '-1')
      sql.andWhere(qB => qB.where('contacts.typeCompany', typeCompany))
  }
  return sql.orderByRaw(crud.parseOrderBy(sort)).paginate(perPage, currentPage)
}

const getGenders = async user => {
  const sql = knex
    .select('gender')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('gender')

  if (user.idResponsibility < ELDER) {
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  return sql
}

const getLanguages = async user => {
  const sql = knex
    .select('idLanguage', 'languages.name as languageName')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('idLanguage', 'languages.name')

  if (user.idResponsibility < ELDER) {
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  return sql
}

const getStatus = async user => {
  const sql = knex
    .select('idStatus', 'status.description as statusDescription')
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .where('detailsContacts.information', WAITING_FEEDBACK)
    .groupBy('idStatus', 'status.description')

  if (user.idResponsibility < ELDER) {
    sql.where(builder =>
      builder
        .where('detailsContacts.createdBy', user.id)
        .orWhere('detailsContacts.idPublisher', user.id)
    )
  }
  return sql
}

const getFiltersWaitingFeedback = async ({ user }) => {
  const genders = await getGenders(user)
  const languages = await getLanguages(user)
  const status = await getStatus(user)
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
