import HttpStatus from 'http-status-codes'
import { ADMIN } from '../constants/permissions.constant'
import permissionsService from '../../services/permissions.service'
import { responseError } from '../helpers/responseGeneric.helper'
import { NO_PERMISSION_ENOUGH } from '../constants/security.constant'
import simpleLog from 'simple-node-logger'

const permissionGuard = async (req, res, next) => {
  try {
    const log = simpleLog.createSimpleLogger('permissions.log')
    const { user, query, method, baseUrl } = req
    const page = baseUrl.slice(1)
    if (
      user.id_responsibility === ADMIN ||
      (await permissionsService.hasPermission(
        user.id_responsibility,
        query.page || page,
        method
      ))
    )
      next()
    else {
      log.info(
        NO_PERMISSION_ENOUGH,
        ' on url: ',
        req.baseUrl,
        ' at ',
        new Date().toJSON(),
        ' request headers: ',
        req.headers
      )

      next(
        responseError({
          cod: NO_PERMISSION_ENOUGH,
          message: NO_PERMISSION_ENOUGH,
          httpErrorCode: HttpStatus.FORBIDDEN
        })
      )
    }
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
