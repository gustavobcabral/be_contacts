import knex from '../database/connection'
import crud from './crudGeneric'

const tableName = 'details_contacts'
const columnPrimary = 'id'
const fields = ['createdAt', 'information', 'id_publisher', 'phone_contact']

async function getDetailsOneContact(phone, limit = 5) {
  return knex
    .select('*')
    .from(tableName)
    .where('phone_contact', '=', phone)
    .orderBy('createdAt', 'desc')
    .limit(limit)
}

async function getDetailsAllContact() {
  return knex
    .select(['details_contacts.*', 'contacts.*'])
    .from(tableName)
    .join('contacts', 'details_contacts.phone_contact', '=', 'contacts.phone')
}

async function creatRecord(data) {
  return crud.createRecord(data, tableName)
}

async function updateRecord(data, id) {
  return crud.updateRecord({ id, data, tableName, columnPrimary })
}

async function deleteRecord(id) {
  return crud.deleteRecord({ id, tableName, columnPrimary })
}

async function deleteRecordByPhone(phone) {
  return knex(tableName)
    .where('phone_contact', '=', phone)
    .delete()
}

export {
  getDetailsOneContact,
  getDetailsAllContact,
  creatRecord,
  updateRecord,
  deleteRecord,
  deleteRecordByPhone,
  columnPrimary,
  fields
}
