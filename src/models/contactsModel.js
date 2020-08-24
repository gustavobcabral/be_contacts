const connection = require("../database/connection");
const tableName = "contacts";
const columnPrimary = "phone";

const detailsContact = require("./detailsContacsModel");
const crud = require("./crudGeneric");

async function getAll() {
  return crud.getAll(tableName);
}

async function getOneRecord(phone) {
  return connection(tableName)
    .select("*")
    .where(columnPrimary, "=", phone)
    .first();
}

async function createRecord(data) {
  return crud.createRecord(data, tableName);
}

async function updateRecord(data, phone) {
  return crud.updateRecord({ id, data, tableName, columnPrimary });
}

async function deleteRecord(phone) {
  detailsContact.deleteRecordByPhone(phone);
  return crud.deleteRecord({ id, tableName, columnPrimary });
}

module.exports = {
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};
