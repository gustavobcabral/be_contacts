import crud from './crudGeneric.model'
import knex from '../database/connection'

import { map, omit, curry, get as getLodash, isNil } from 'lodash/fp'
import asyncPipe from 'pipeawait'

const tableName = 'publishers'
const columnPrimary = 'id'
const omitColumns = ['password', 'haveToReauthenticate']

// const getAllNew = async queryParams =>
//   await asyncPipe(getAllAllowedForMe, removeColumnNotAllowed)(queryParams)
//const getAll = async queryParams => {
//  const { sort = 'name:ASC', perPage, currentPage, filters } = queryParams

const getAllWithPagination = async queryParams => {
  const { sort = 'name:ASC', perPage, currentPage, filters } = queryParams

  return knex
    .select(
      'publishers.id',
      'publishers.name',
      'publishers.phone',
      'publishers.email',
      'publishers.idResponsibility',
      'responsibility.description as responsibilityDescription '
    )
    .from(tableName)
    .leftJoin(
      'responsibility',
      'publishers.idResponsibility',
      '=',
      'responsibility.id'
    )
    .orderByRaw(crud.parseOrderBy(sort))
}

const removeColumnNotAllowed = data => map(pub => omit(omitColumns, pub), data)

const getAll = async queryParams =>
  await asyncPipe(crud.getAll, removeColumnNotAllowed)(queryParams)

const getOneRecord = async id =>
  crud.getOneRecord({ id, tableName, columnPrimary })

const getRecordForAuth = async (id, column) =>
  crud.getOneRecord({ id, tableName, columnPrimary: column })

const createRecord = async data =>
  await asyncPipe(
    curry(crud.createRecord)(data),
    removeColumnNotAllowed
  )(tableName)

const updateRecord = async ({ id, data }) =>
  await asyncPipe(crud.updateRecord, data => ({
    ...data,
    data: removeColumnNotAllowed(data.data)
  }))({ id, data, tableName, columnPrimary })

const deleteRecord = async id =>
  crud.deleteRecord({ id, tableName, columnPrimary })

export {
  getAllWithPagination,
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordForAuth,
  omitColumns
}
