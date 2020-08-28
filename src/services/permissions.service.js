/* eslint-disable @typescript-eslint/camelcase */
import { getUserPermission } from '../models/permissions.model'

const hasPermission = async (userIdResponsibility, page, method) => {
  const { id_minimum_responsibility_required } = await getUserPermission(
    page,
    method
  )
  return userIdResponsibility >= id_minimum_responsibility_required
}

export { hasPermission }
