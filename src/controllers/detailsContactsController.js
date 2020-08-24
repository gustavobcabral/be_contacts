/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable fp/no-mutation */
const {
  getDetailsOneContact,
  getDetailsAllContact,
  creatRecord,
  updateRecord,
  deleteRecord
} = require('../models/detailsContactsModel')

async function get(request, response) {
  const datailscontacts = await getDetailsAllContact()
  return response.json(datailscontacts)
}

async function getOne(request, response) {
  const datailscontacts = await getDetailsOneContact(request.params.id)
  return response.json(datailscontacts)
}

async function create(request, response) {
  const data = {
    ...request.body,
    phone_contact: request.params.id
  }

  try {
    const newData = await creatRecord(data)
    response
      .status(200)
      .json({ status: true, message: 'CREATING_SUCCESSFUL', data: newData })
  } catch (error) {
    response.status(500).json({
      status: false,
      message: 'ERROR_WHILE_CREATING',
      error
    })
  }
}

async function update(request, response) {
  const { id } = request.params
  const data = request.body

  try {
    const recordsAffected = await updateRecord(data, id)
    let statusCode = 200
    let json = {
      status: true,
      message: 'UPDATE_SUCCESSFUL',
      data: recordsAffected
    }
    if (recordsAffected.length === 0) {
      statusCode = 500
      json = { status: false, message: 'UPDATE_FAIL' }
    }
    return response.status(statusCode).json(json)
  } catch (error) {
    console.log(error)
    response.status(500).json({
      status: false,
      message: 'ERROR_WHILE_UPDATE',
      error
    })
  }
}

async function deleteOne(request, response) {
  try {
    const recordsAffected = await deleteRecord(request.params.id)
    let statusCode = 200
    let json = { status: true, message: 'DELETED_SUCCESSFUL' }
    if (recordsAffected === 0) {
      statusCode = 500
      json = { status: false, message: 'DELETED_FAIL' }
    }
    return response.status(statusCode).json(json)
  } catch (error) {
    response.status(500).json({
      status: false,
      message: 'ERROR_WHILE_DELETING',
      error
    })
  }
}
export default { get, getOne, create, update, deleteOne }
