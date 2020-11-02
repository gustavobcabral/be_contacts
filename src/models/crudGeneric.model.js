import knex from '../config/connection'
import { split, map, pipe, head, last, includes, curry } from 'lodash/fp'

const getAll = async (tableName, queryParams = {}) => {
  const { perPage, currentPage, sort } = queryParams
  const sql = knex.select().from(tableName)
  if (sort) sql.orderByRaw(parseOrderBy(sort))
  if (perPage && currentPage) sql.paginate(perPage, currentPage)

  return sql
}

const getOneRecord = async ({ id, tableName, columnPrimary }) =>
  knex
    .select()
    .from(tableName)
    .where(columnPrimary, '=', id)
    .first()

const getAllWithWhere = async ({ tableName, where }) =>
  knex
    .select()
    .from(tableName)
    .where(where)

const getOneWithWhere = async ({ tableName, where }) =>
  knex
    .select()
    .from(tableName)
    .where(where)
    .first()

const createRecord = async (data, tableName) =>
  await knex(tableName)
    .returning('*')
    .insert(data)

const prepareDataUpdated = (id, data) => ({
  totalAffected: data.length,
  id,
  data
})

const prepareDataUpdatedWithoutId = data => ({
  totalAffected: data.length,
  data
})

const updateRecord = async ({ id, data, tableName, columnPrimary }) =>
  prepareDataUpdated(
    id,
    await knex(tableName)
      .update(data, Object.keys(data))
      .where(columnPrimary, id)
  )

const updateRecords = async ({ data, tableName, where }) =>
  prepareDataUpdatedWithoutId(
    await knex(tableName)
      .update(data, Object.keys(data))
      .where(where)
  )

const prepareDataDeleted = (id, totalAffected) => ({
  totalAffected,
  id
})

const prepareDataDeletedWithoutId = totalAffected => ({
  totalAffected
})

const deleteRecord = async ({ id, tableName, columnPrimary }) =>
  prepareDataDeleted(
    id,
    await knex(tableName)
      .where(columnPrimary, id)
      .delete()
  )

const deleteRecords = async ({ where, tableName }) =>
  prepareDataDeletedWithoutId(
    await knex(tableName)
      .where(where)
      .delete()
  )

const columnsForbiddenUpper = ['createdAt']

const cantUpperThisColumn = column =>
  pipe(split('.'), last, curry(includes)(columnsForbiddenUpper))(column)

const parseOrderBy = sort =>
  pipe(
    split(','),
    map(field => {
      const arrayField = split(':', field)
      const column = head(arrayField)
      const order = last(arrayField)
      return sort.length === 1
        ? !cantUpperThisColumn(column)
          ? `UPPER(${column})`
          : column
        : !cantUpperThisColumn(column)
        ? `UPPER(${column}) ${order}`
        : `${column} ${order}`
    })
  )(sort)

export default {
  getAll,
  createRecord,
  updateRecord,
  updateRecords,
  deleteRecord,
  deleteRecords,
  getOneRecord,
  parseOrderBy,
  getAllWithWhere,
  getOneWithWhere
}
