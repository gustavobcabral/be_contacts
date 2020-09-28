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
<<<<<<< HEAD
    .select(
      'publishers.name',
      'details_contacts.information',
      'details_contacts.createdAt',
      'details_contacts.id_publisher',
      'details_contacts.id'
    )
    .from(tableName)
    .leftJoin(
      'publishers',
      'details_contacts.id_publisher',
      '=',
      'publishers.id'
    )
    .where('phone_contact', '=', phone)
=======
    .select('detailsContacts.*', 'publishers.name as publisherName')
    .from(tableName)
    .leftJoin('publishers', 'detailsContacts.idPublisher', '=', 'publishers.id')
    .where('phoneContact', '=', phone)
>>>>>>> 2827091c80ae680331fac0f27ebd61e9396ccfa6
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
