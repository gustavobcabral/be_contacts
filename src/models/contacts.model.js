import knex from '../config/connection'
import * as detailsContact from './detailsContacts.model'
import crud from './crudGeneric.model'
import { WAITING_FEEDBACK } from '../shared/constants/contacts.constant'
import { isEmpty, map, contains, first, last } from 'lodash/fp'

const tableName = 'contacts'
const columnPrimary = 'phone'
const fields = [
  'phone',
  'name',
  'owner',
  'idStatus',
  'idLanguage',
  'languageName',
  'statusDescription',
  'gender',
  'namePublisher',
  'phone2',
  'location',
  'email',
  'note',
  'typeCompany'
]

const getAll = async queryParams => {
  const { sort = 'name:ASC', perPage, currentPage, filters } = queryParams
  const sql = knex
    .select(
      'contacts.name',
      'contacts.owner',
      'contacts.phone',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.gender',
      'contacts.typeCompany',
      'contacts.location',
      'contacts.email',
      'contacts.note',
      'languages.name as languageName',
      'status.description as statusDescription'
    )
    .from(tableName)
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')

  if (!isEmpty(filters)) {
    const {
      name,
      owner,
      phone,
      genders,
      note,
      languages,
      status,
      typeCompany
    } = JSON.parse(filters)

    if (
      !isEmpty(name) &&
      !isEmpty(phone) &&
      !isEmpty(note) &&
      !isEmpty(owner)
    ) {
      sql.where(builder =>
        builder
          .where('contacts.name', 'ilike', `%${name}%`)
          .orWhere('contacts.owner', 'ilike', `%${owner}%`)
          .orWhere('contacts.phone', 'ilike', `%${phone}%`)
          .orWhere('contacts.note', 'ilike', `%${note}%`)
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
  const data = await sql
    .orderByRaw(crud.parseOrderBy(sort))
    .paginate(perPage, currentPage)

  const list = await Promise.all(
    map(async row => {
      const detailsDB = await knex
        .select()
        .from('detailsContacts')
        .where('phoneContact', row.phone)
        .orderBy('createdAt', 'desc')
        .limit(2)

      const isWaitingFeedback = await knex
        .count('id')
        .from('detailsContacts')
        .where('phoneContact', row.phone)
        .where('information', WAITING_FEEDBACK)
        .first()

      if (detailsDB.length > 0) {
        const lastDetails = first(detailsDB)
        const beforeLastDetails = last(detailsDB)
        const waitingFeedback = isWaitingFeedback.count > 0
        const details = !waitingFeedback
          ? lastDetails
          : !contains(WAITING_FEEDBACK, beforeLastDetails.information)
          ? beforeLastDetails
          : {}
        return {
          ...row,
          waitingFeedback,
          details
        }
      } else {
        return {
          ...row,
          waitingFeedback: false,
          details: {}
        }
      }
    }, data.list)
  )

  return {
    ...data,
    list
  }
}

const getGenders = async () =>
  knex
    .select('gender')
    .from(tableName)
    .groupBy('gender')

const getLanguages = async () =>
  knex
    .select('idLanguage', 'languages.name as languageName')
    .from(tableName)
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .groupBy('idLanguage', 'languages.name')

const getStatus = async () =>
  knex
    .select('idStatus', 'status.description as statusDescription')
    .from(tableName)
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .groupBy('idStatus', 'status.description')

const getFilters = async () => {
  const genders = await getGenders()
  const languages = await getLanguages()
  const status = await getStatus()
  return { genders, languages, status }
}

const getOneWithDetails = async phone =>
  knex
    .select(
      'contacts.name',
      'contacts.owner',
      'contacts.phone',
      'contacts.phone2',
      'contacts.idStatus',
      'contacts.gender',
      'contacts.idLanguage',
      'contacts.typeCompany',
      'contacts.location',
      'contacts.email',
      'contacts.note',
      'detailsContacts.*'
    )
    .from(tableName)
    .leftJoin(
      'detailsContacts',
      'detailsContacts.phoneContact',
      '=',
      'contacts.phone'
    )
    .where(columnPrimary, '=', phone)

const createRecord = async data => crud.createRecord(data, tableName)

const updateRecord = async ({ id, data }) =>
  crud.updateRecord({ id, data, tableName, columnPrimary })

async function deleteRecord(id) {
  await detailsContact.deleteRecordByPhone(id)
  return crud.deleteRecord({ id, tableName, columnPrimary })
}

const getSummaryTotals = async userId => {
  const totalContacts = await knex('contacts')
    .count('phone')
    .first()

  const totalContactsByType = await knex('contacts')
    .count('phone')
    .select('typeCompany')
    .groupBy('typeCompany')

  const totalContactsByGender = await knex('contacts')
    .count('gender')
    .select('gender')
    .where('typeCompany', false)
    .groupBy('gender')

  const totalContactsNotCompanyContacted = await knex('detailsContacts')
    .countDistinct('phone')
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
    .where('contacts.typeCompany', false)
    .whereNot({ information: WAITING_FEEDBACK })
    .first()

  const totalContactsByGenderContacted = await knex('detailsContacts')
    .countDistinct('phone')
    .select('gender')
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
    .where('contacts.typeCompany', false)
    .whereNot({ information: WAITING_FEEDBACK })
    .groupBy('contacts.gender')

  const totalContactsByLanguage = await knex('contacts')
    .count('phone')
    .select(
      'languages.name as languageName',
      'languages.color as languageColor'
    )
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .groupBy('languages.name', 'languages.color')

  const totalContactsByLanguageContacted = await knex('detailsContacts')
    .countDistinct('contacts.phone')
    .select(
      'languages.name as languageName',
      'languages.color as languageColor'
    )
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .whereNot({ information: WAITING_FEEDBACK })
    .groupBy('languages.name', 'languages.color')

  const totalContactsContacted = await knex('detailsContacts')
    .countDistinct('phoneContact')
    .whereNot({ information: WAITING_FEEDBACK })
    .first()

  const totalContactsAssignByMeWaitingFeedback = await knex('detailsContacts')
    .countDistinct('phoneContact')
    .where({ information: WAITING_FEEDBACK, createdBy: userId })
    .first()

  const totalContactsWaitingFeedback = await knex('detailsContacts')
    .countDistinct('phoneContact')
    .where({ information: WAITING_FEEDBACK })
    .first()

  const totalsContactsWaitingFeedbackByPublisher = await knex('detailsContacts')
    .count('phoneContact as count')
    .select('publishers.name as publisherName')
    .leftJoin('publishers', 'publishers.id', '=', 'detailsContacts.createdBy')
    .where({ information: WAITING_FEEDBACK })
    .groupBy('publishers.name')

  return {
    totalContacts,
    totalContactsContacted,
    totalContactsAssignByMeWaitingFeedback,
    totalContactsWaitingFeedback,
    totalsContactsWaitingFeedbackByPublisher,
    totalContactsByGender,
    totalContactsByGenderContacted,
    totalContactsByLanguage,
    totalContactsByLanguageContacted,
    totalContactsNotCompanyContacted,
    totalContactsByType
  }
}

export {
  createRecord,
  updateRecord,
  deleteRecord,
  getAll,
  getOneWithDetails,
  getSummaryTotals,
  getFilters,
  columnPrimary,
  fields
}
