import crud from './crudGeneric'

const tableName = 'languages'
const columnPrimary = 'id'

async function getAll() {
  return crud.getAll(tableName)
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
export { getAll, createRecord, updateRecord, deleteRecord }
