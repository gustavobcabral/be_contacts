import detailsService from '../services/detailsContacts.service'
import { responseNext } from '../shared/helpers/responseGeneric.helper'

const get = async (request, response, next) => {
  try {
    response.json(await detailsService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await detailsService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await detailsService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await detailsService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}
export default { get, create, update, deleteOne }
