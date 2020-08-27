import crud from './crudGeneric'

const tableName = 'status'
const columnPrimary = 'id'
const fields = ['description']

const getAll = async queryParams => crud.getAll(tableName, queryParams)

const createRecord = async data => crud.createRecord(data, tableName)

const updateRecord = async ({ id, data }) =>
  crud.updateRecord({ id, data, tableName, columnPrimary })

const deleteRecord = async id =>
  crud.deleteRecord({ id, tableName, columnPrimary })

export { getAll, createRecord, updateRecord, deleteRecord, fields }
