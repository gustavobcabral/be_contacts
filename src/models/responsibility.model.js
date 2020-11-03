import knex from '../config/connection'
import { getOr } from 'lodash/fp'

const tableName = 'responsibility'
const columnPrimary = 'id'
const fields = ['description']

const getAllAllowedForMe = async queryParams =>
  knex
    .select()
    .from(tableName)
    .where(columnPrimary, '<=', getOr(0, 'user.idResponsibility', queryParams))
    .orderBy(columnPrimary)

export { getAllAllowedForMe, fields }
