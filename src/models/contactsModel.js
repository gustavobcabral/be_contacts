import knex from '../database/connection'
import * as detailsContact from './detailsContactsModel'
import crud from './crudGeneric'

const tableName = 'contacts'
const columnPrimary = 'phone'
const fields = ['phone', 'name', 'id_status', 'id_language']

const getAllWithDetails = async queryParams => {
  const { sort = 'name:ASC', perPage, currentPage } = queryParams
  return knex
    .select(
      'contacts.name',
      'contacts.phone',
      'contacts.id_status',
      'contacts.id_language',
      'details_contacts.*'
    )
    .from(tableName)
    .leftJoin(
      'details_contacts',
      'details_contacts.phone_contact',
      '=',
      'contacts.phone'
    )
    .orderByRaw(crud.parseOrderBy(sort))
    .paginate(perPage, currentPage)
}
const getOneWithDetails = async phone =>
  knex
    .select(
      'contacts.name',
      'contacts.phone',
      'contacts.id_status',
      'contacts.id_language',
      'details_contacts.*'
    )
    .from(tableName)
    .leftJoin(
      'details_contacts',
      'details_contacts.phone_contact',
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

export {
  createRecord,
  updateRecord,
  deleteRecord,
  getAllWithDetails,
  getOneWithDetails,
  columnPrimary,
  fields
}
