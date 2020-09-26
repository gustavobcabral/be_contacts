import knex from '../database/connection'
import * as detailsContact from './detailsContacts.model'
import crud from './crudGeneric.model'

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

const getSummaryTotals = async () => {
  const totalContacts = await knex('contacts')
    .count('phone')
    .first()
  const totalContactsContacted = await knex('detailsContacts')
    .countDistinct('phoneContact')
    .first()

  return { totalContacts, totalContactsContacted }
}

export {
  createRecord,
  updateRecord,
  deleteRecord,
  getAllWithDetails,
  getOneWithDetails,
  getSummaryTotals,
  columnPrimary,
  fields
}
