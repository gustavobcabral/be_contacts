import knex from '../database/connection'
import * as detailsContact from './detailsContacts.model'
import crud from './crudGeneric.model'
import { WAITING_FEEDBACK } from '../shared/constants/contacts.constant'
const tableName = 'contacts'
const columnPrimary = 'phone'
const fields = [
  'phone',
  'name',
  'idStatus',
  'idLanguage',
  'languageName',
  'statusDescription',
  'namePublisher'
]

const getAllWithDetails = async queryParams => {
  const { sort = 'name:ASC', perPage, currentPage } = queryParams
  return knex
    .select(
      'contacts.name',
      'contacts.phone',
      'contacts.idStatus',
      'contacts.idLanguage',
      'languages.name as languageName',
      'status.description as statusDescription',
      'detailsContacts.createdAt',
      'detailsContacts.information',
      'detailsContacts.id as idDetail',
      'detailsContacts.createdBy',
      'pubCreator.name as createdByName',
      'pubUpdater.name as updatedByName',
      'detailsContacts.updatedBy',
      'publishers.name as namePublisher'
    )
    .from(tableName)
    .leftJoin(
      'detailsContacts',
      'detailsContacts.phoneContact',
      '=',
      'contacts.phone'
    )
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .leftJoin('publishers', 'publishers.id', '=', 'detailsContacts.idPublisher')
    .leftJoin(
      'publishers as pubCreator',
      'pubCreator.id',
      '=',
      'detailsContacts.createdBy'
    )
    .leftJoin(
      'publishers as pubUpdater',
      'pubUpdater.id',
      '=',
      'detailsContacts.updatedBy'
    )
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .orderByRaw(crud.parseOrderBy(sort))
    .paginate(perPage, currentPage)
}

const getOneWithDetails = async phone =>
  knex
    .select(
      'contacts.name',
      'contacts.phone',
      'contacts.idStatus',
      'contacts.idLanguage',
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
  detailsContact.deleteRecordByPhone(id)
  return crud.deleteRecord({ id, tableName, columnPrimary })
}

const getAllWaitingFeedback = async () =>
  await knex('detailsContacts')
    .select(
      'contacts.name',
      'contacts.phone',
      'contacts.idStatus',
      'contacts.idLanguage',
      'detailsContacts.*',
      'publishers.name as publisherName'
    )
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
    .leftJoin('publishers', 'publishers.id', '=', 'detailsContacts.idPublisher')
    .where({ information: WAITING_FEEDBACK })

const getSummaryTotals = async idPublisher => {
  const totalContacts = await knex('contacts')
    .count('phone')
    .first()

  const totalContactsByGender = await knex('contacts')
    .count('gender')
    .select('gender')
    .groupBy('gender')

  const totalContactsByGenderContacted = await knex('detailsContacts')
    .countDistinct('phone')
    .select('gender')
    .leftJoin('contacts', 'contacts.phone', '=', 'detailsContacts.phoneContact')
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
    .where({ information: WAITING_FEEDBACK, idPublisher })
    .first()

  const totalContactsWaitingFeedback = await knex('detailsContacts')
    .countDistinct('phoneContact')
    .where({ information: WAITING_FEEDBACK })
    .first()

  const totalsContactsWaitingFeedbackByPublisher = await knex('detailsContacts')
    .count('phoneContact as count')
    .select('publishers.name as publisherName')
    .leftJoin('publishers', 'publishers.id', '=', 'detailsContacts.idPublisher')
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
    totalContactsByLanguageContacted
  }
}

export {
  createRecord,
  updateRecord,
  deleteRecord,
  getAllWithDetails,
  getOneWithDetails,
  getSummaryTotals,
  getAllWaitingFeedback,
  columnPrimary,
  fields
}
