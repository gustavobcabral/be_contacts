import crud from './crudGeneric'
import { encrypt } from '../helpers/genericHelpers'
import { map, omit } from 'lodash/fp'

const tableName = 'publishers'
const columnPrimary = 'id'
const omitColumns = ['password']

async function getAll() {
  return map(pub => omit(omitColumns, pub), await crud.getAll(tableName))
}

async function getOneRecord(id) {
  return omit(
    omitColumns,
    await crud.getOneRecord({ id, tableName, columnPrimary })
  )
}

async function createRecord(data) {
  const parseData = data.password
    ? {
        ...data,
        password: encrypt(data.password)
      }
    : data
  return crud.createRecord(parseData, tableName)
}

async function updateRecord(id, data) {
  const parseData = data.password
    ? {
        ...data,
        password: encrypt(data.password)
      }
    : data

  return crud.updateRecord({ id, parseData, tableName, columnPrimary })
}

async function deleteRecord(id) {
  return crud.deleteRecord({ id, tableName, columnPrimary })
}
export { getAll, getOneRecord, createRecord, updateRecord, deleteRecord }
