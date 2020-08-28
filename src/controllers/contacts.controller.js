import contactsService from '../services/contacts.service'
import { responseNext } from '../shared/helpers/responseGeneric'

const get = async (request, response, next) => {
  try {
    response.json(await contactsService.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getOne = async (request, response, next) => {
  try {
    response.json(await contactsService.getOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await contactsService.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await contactsService.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await contactsService.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default { get, getOne, create, update, deleteOne }
