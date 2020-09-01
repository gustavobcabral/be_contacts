import crud from './crudGeneric.model'
import knex from '../database/connection'

import { encrypt } from '../shared/helpers/generic.helper'
import { map, omit, curry, get as getLodash } from 'lodash/fp'
import asyncPipe from 'pipeawait'

const tableName = 'publishers'
const columnPrimary = 'id'
const omitColumns = ['password', 'have_to_reauthenticate']

const removeColumnNotAllowed = data => map(pub => omit(omitColumns, pub), data)

const getAll = async queryParams =>
  await asyncPipe(getAllAllowedForMe, removeColumnNotAllowed)(queryParams)

const getAllAllowedForMe = async queryParams =>
  knex
    .select()
    .from(tableName)
    .where(
      'id_responsibility',
      '<=',
      getLodash('user.id_responsibility', queryParams)
    )

const getOneRecord = async id =>
  crud.getOneRecord({ id, tableName, columnPrimary })

const getRecordForAuth = async (id, column) =>
  crud.getOneRecord({ id, tableName, columnPrimary: column })

const createRecord = async data => {
  const parseData = data.password
    ? {
        ...data,
        password: encrypt(data.password)
      }
    : data
  return await asyncPipe(
    curry(crud.createRecord)(parseData),
    removeColumnNotAllowed
  )(tableName)
}

const updateRecord = async ({ id, data }) => {
  const parseData = data.password
    ? {
        ...data,
        password: encrypt(data.password)
      }
    : data
  return await asyncPipe(crud.updateRecord, data => ({
    ...data,
    data: removeColumnNotAllowed(data.data)
  }))({ id, data: parseData, tableName, columnPrimary })
}

const deleteRecord = async id =>
  crud.deleteRecord({ id, tableName, columnPrimary })

export {
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordForAuth,
  omitColumns
}
