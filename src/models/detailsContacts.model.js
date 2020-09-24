import knex from '../database/connection'
import crud from './crudGeneric.model'

const tableName = 'details_contacts'
const columnPrimary = 'id'
const fields = ['createdAt', 'information', 'id_publisher', 'phone_contact']

async function getDetailsOneContact(phone, limit = 5) {
  console.log(phone)
  return knex
    .select()
    .from(tableName)
    .where('phone_contact', '=', phone)
    .orderBy('createdAt', 'desc')
    .limit(limit)
}

async function getDetailsAllContact() {
  return knex
    .select()
    .from(tableName)
    .leftJoin(
      'contacts',
      'details_contacts.phone_contact',
      '=',
      'contacts.phone'
    )
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
    .where('phone_contact', '=', phone)
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
  fields
}
