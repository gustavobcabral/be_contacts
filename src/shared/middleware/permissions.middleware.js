import HttpStatus from 'http-status-codes'
import { ADMIN } from '../constants/permissions'
import { hasPermission } from '../../services/permissions.service'
import { responseError } from '../helpers/responseGeneric'
import { NO_PERMISSION_ENOUGH } from '../constants/security'

const permissionGuard = async (req, res, next) => {
  try {
    const { user, query, method, baseUrl } = req
    const page = baseUrl.slice(1)
    user.id_responsibility === ADMIN ||
    (await hasPermission(user.id_responsibility, query.page || page, method))
      ? next()
      : next(
          responseError({
            cod: NO_PERMISSION_ENOUGH,
            message: NO_PERMISSION_ENOUGH,
            httpErrorCode: HttpStatus.FORBIDDEN
          })
        )
  } catch (error) {
    next(
      responseError({
        cod: NO_PERMISSION_ENOUGH,
        httpErrorCode: HttpStatus.FORBIDDEN,
        message: error
      })
    )
  }
}

export { permissionGuard }
