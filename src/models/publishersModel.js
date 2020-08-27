import crud from './crudGeneric'
import { encrypt } from '../helpers/genericHelpers'
import { map, omit } from 'lodash/fp'

const tableName = 'publishers'
const columnPrimary = 'id'
const omitColumns = ['password']

const getAll = async queryParams => {
  return map(
    pub => omit(omitColumns, pub),
    await crud.getAll(tableName, queryParams)
  )
}

const getOneRecord = async id => {
  return omit(
    omitColumns,
    await crud.getOneRecord({ id, tableName, columnPrimary })
  )
}

const getRecordForAuth = async (id, column) => {
  return omit(
    omitColumns,
    await crud.getOneRecord({ id, tableName, columnPrimary: column })
  )
}

const createRecord = async data => {
  const parseData = data.password
    ? {
        ...data,
        password: encrypt(data.password)
      }
    : data
  return crud.createRecord(parseData, tableName)
}

const updateRecord = async ({ id, data }) => {
  const parseData = data.password
    ? {
        ...data,
        password: encrypt(data.password)
      }
    : data

  return crud.updateRecord({ id, parseData, tableName, columnPrimary })
}

const deleteRecord = async id => {
  return crud.deleteRecord({ id, tableName, columnPrimary })
}
export {
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordForAuth
}
