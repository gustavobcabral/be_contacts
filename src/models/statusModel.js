import crud from './crudGeneric'

const tableName = 'status'
const columnPrimary = 'id'
const fields = ['description']

const getAll = async queryParams => {
  return crud.getAll(tableName, queryParams)
}

const createRecord = async data => {
  return crud.createRecord(data, tableName)
}

const updateRecord = async ({ id, data }) => {
  return crud.updateRecord({ id, data, tableName, columnPrimary })
}

const deleteRecord = async id => {
  return crud.deleteRecord({ id, tableName, columnPrimary })
}

export { getAll, createRecord, updateRecord, deleteRecord, fields }
