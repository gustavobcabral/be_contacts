import { responseNext } from '../shared/helpers/responseGeneric.helper'
import publishers from '../services/publishers.service'

const getAllInformation = async (request, response, next) => {
  try {
    response.json(await publishers.getAllInformation(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}
const get = async (request, response, next) => {
  try {
    response.json(await publishers.get(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const getOne = async (request, response, next) => {
  try {
    response.json(await publishers.getOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const create = async (request, response, next) => {
  try {
    response.json(await publishers.create(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const update = async (request, response, next) => {
  try {
    response.json(await publishers.update(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

const deleteOne = async (request, response, next) => {
  try {
    response.json(await publishers.deleteOne(request))
  } catch (error) {
    next(responseNext(error, request))
  }
}

export default { getAllInformation, get, getOne, create, update, deleteOne }
