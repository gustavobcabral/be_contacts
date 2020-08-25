import { get, find } from 'lodash/fp'

const getParamsForUpdate = request => ({
  data: get('body', request),
  id: get('params.id', request)
})

const getParamsForGet = request => get('query', request)
const getParamsForCreate = request => get('body', request)
const getParamsForGetOne = request => get('params.id', request)
const getParamsForDelete = request => getParamsForGetOne(request)

const defaultValueForQuery = (request, objectDefault) =>
  find(objectDefault, getParamsForGet(request))
    ? getParamsForGet(request)
    : { ...getParamsForGet(request), ...objectDefault }

export {
  getParamsForGet,
  getParamsForUpdate,
  getParamsForCreate,
  getParamsForGetOne,
  getParamsForDelete,
  defaultValueForQuery
}
