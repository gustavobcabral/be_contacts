import crud from './crudGeneric'

const tableName = 'publishers'
const columnPrimary = 'id'

async function getAll() {
  return crud.getAll(tableName)
}

async function getOneRecord(id) {
  return crud.getOneRecord({ id, tableName, columnPrimary })
}

async function createRecord(data) {
  return crud.createRecord(data, tableName)
}

async function updateRecord(id, data) {
  return crud.updateRecord({ id, data, tableName, columnPrimary })
}

async function deleteRecord(id) {
  return crud.deleteRecord({ id, tableName, columnPrimary })
}
export { getAll, getOneRecord, createRecord, updateRecord, deleteRecord }
