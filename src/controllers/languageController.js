const {
  getAll,
  createRecord,
  updateRecord,
  deleteRecord,
} = require("../models/languageModel");

async function get(request, response) {
  const status = await getAll();
  return response.json(status);
}

async function create(request, response) {
  try {
    const newData = await createRecord(request.body);
    response
      .status(200)
      .json({ status: true, message: "CREATING_SUCCESSFUL", data: newData });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: false,
      message: "ERROR_WHILE_CREATING",
      error,
    });
  }
}

async function update(request, response) {
  try {
    const recordsAffected = await updateRecord(request.params.id, request.body);
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

module.exports = { get, create, update, deleteOne };
