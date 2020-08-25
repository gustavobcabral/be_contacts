import knex from '../database/connection'
import { split, map, pipe, head, last, find, isEmpty } from 'lodash/fp'
import { fieldsNoTypeText } from '../constants/db'

const getAll = async (tableName, queryParams = {}) => {
  const { perPage, currentPage, sort } = queryParams
  const sql = knex.select().from(tableName)
  if (sort) sql.orderByRaw(parseOrderBy(sort))
  if (perPage && currentPage) sql.paginate(perPage, currentPage)

  return sql
}

const getOneRecord = async ({ id, tableName, columnPrimary }) => {
  return knex
    .select()
    .from(tableName)
    .where(columnPrimary, '=', id)
    .first()
}

const createRecord = async (data, tableName) => {
  return await knex(tableName)
    .returning('*')
    .insert(data)
}

const prepareDataUpdated = (id, data) => {
  return { totalAffected: data.length, id, data }
}

const updateRecord = async ({ id, data, tableName, columnPrimary }) => {
  return prepareDataUpdated(
    id,
    await knex(tableName)
      .update(data, Object.keys(data))
      .where(columnPrimary, id)
  )
}

const prepareDataDeleted = (id, totalAffected) => ({
  totalAffected,
  id
})

const deleteRecord = async ({ id, tableName, columnPrimary }) => {
  return prepareDataDeleted(
    id,
    await knex(tableName)
      .where(columnPrimary, id)
      .delete()
  )
}

const isColumnTypeText = column => isEmpty(find(column, fieldsNoTypeText))

const parseOrderByForFieldText = column =>
  isColumnTypeText(column) ? ` LOWER(${column})` : column

const parseOrderBy = sort => {
  return pipe(
    split(','),
    map(field => {
      const arrayField = split(':', field)
      const column = head(arrayField)
      const order = last(arrayField)
      return sort.length === 1 ? column : `${column} ${order}`
    })
  )(sort)
}

export default {
  getAll,
  createRecord,
  updateRecord,
  deleteRecord,
  getOneRecord,
  parseOrderBy
}
