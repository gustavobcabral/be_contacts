import knex from '../database/connection'
import crud from './crudGeneric.model'
import { isEmpty } from 'lodash/fp'

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

const getDetailsOneContact = async (phone, limit = 5) => {
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
    .where('phoneContact', '=', phone)
    .orderBy('createdAt', 'desc')
  if (!isEmpty(limit) && limit > 0) sql.limit(limit)
  return sql
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
  getDetailsOneContact,
  getDetailsAllContact,
  createRecord,
  updateRecord,
  updateRecords,
  deleteRecord,
  deleteRecords,
  deleteRecordByPhone,
  columnPrimary,
  fields,
  getOne
}
