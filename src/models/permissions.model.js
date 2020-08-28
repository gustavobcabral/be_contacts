import crud from './crudGeneric.model'
import { toLower } from 'lodash/fp'

const tableName = 'permissions'

const getUserPermission = async (page, method) =>
  crud.getOneWithWhere({
    tableName,
    where: { page: toLower(page), method: toLower(method) }
  })

export { getUserPermission }
