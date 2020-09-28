import knex from '../database/connection'
import crud from './crudGeneric.model'

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

async function getDetailsOneContact(phone, limit = 5) {
  return knex
    .select(
      'detailsContacts.information',
      'detailsContacts.createdAt',
      'detailsContacts.idPublisher',
      'detailsContacts.id',
      'publishers.name as publisherName'
    )
    .from(tableName)
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .where('phoneContact', '=', phone)
    .orderBy('createdAt', 'desc')
    .limit(limit)
}

async function getOne(id) {
  return knex
    .select(
      'detailsContacts.*',
      'publishers.name as publisherName',
      'contacts.idStatus'
    )
    .from(tableName)
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')

    .where('detailsContacts.id', id)
    .first()
}

async function getDetailsAllContact() {
  return knex
    .select()
    .from(tableName)
    .leftJoin('contacts', 'detailsContacts.phoneContact', '=', 'contacts.phone')
}

const createRecord = async data => crud.createRecord(data, tableName)

const updateRecord = async ({ id, data }) => {
  console.log(id, data, "MERDA")
  return crud.updateRecord({ id, data, tableName, columnPrimary })
}

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
