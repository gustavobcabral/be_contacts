const {
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../models/contactsModel");
const { getDetailsOneContact } = require("../models/detailsContacsModel");

async function get(request, response) {
  const contacts = await getAll();
  const newContacts = [];
  for (const contact of contacts) {
    const details = await getDetailsOneContact(contact.phone, 2);
    const contactDetails = {
      ...contact,
      details,
    };
    newContacts.push(contactDetails);
  }
  return response.json(newContacts);
}

async function getOne(request, response) {
  const { id } = request.params;
  const contact = await getOneRecord(id);
  const details = await getDetailsOneContact(contact.phone);

  const contactDetails = {
    ...contact,
    details,
  };

  return response.json(contactDetails);
}
async function create(request, response) {
  try {
    const newData = await createRecord(request.body);
    response
      .status(200)
      .json({ status: true, message: "CREATING_SUCCESSFUL", data: newData });
  } catch (error) {
    response.status(500).json({
      status: false,
      message: "ERROR_WHILE_CREATING",
      error,
    });
  }
}

async function update(request, response) {
  try {
    const recordsAffected = await updateRecord(request.body, request.params.id);
    let statusCode = 200;
    let json = {
      status: true,
      message: "UPDATE_SUCCESSFUL",
      data: recordsAffected,
    };
    if (recordsAffected.length === 0) {
      statusCode = 500;
      json = { status: false, message: "UPDATE_FAIL" };
    }
    return response.status(statusCode).json(json);
  } catch (error) {
    response.status(500).json({
      status: false,
      message: "ERROR_WHILE_UPDATE",
      error,
    });
  }
}

async function deleteOne(request, response) {
  try {
    const recordsAffected = await deleteRecord(request.params.id);
    let statusCode = 200;
    let json = { status: true, message: "DELETED_SUCCESSFUL" };
    if (recordsAffected === 0) {
      statusCode = 500;
      json = { status: false, message: "DELETED_FAIL" };
    }
    return response.status(statusCode).json(json);
  } catch (error) {
    response.status(500).json({
      status: false,
      message: "ERROR_WHILE_DELETING",
      error,
    });
  }
}

module.exports = { get, getOne, create, update, deleteOne };
