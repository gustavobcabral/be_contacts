const connection = require("../database/connection");
const tableName = "publishers";
const columnPrimary = "id";

const crud = require("./crudGeneric");

async function getAll() {
  return crud.getAll(tableName);
}

async function getOneRecord(id) {
  return connection(tableName).select("*").where("id", "=", id).first();
}

async function createRecord(data) {
  return crud.createRecord(data, tableName);
}

async function updateRecord(id, data) {
  return crud.updateRecord({ id, data, tableName, columnPrimary });
}

async function deleteRecord(id) {
  return crud.deleteRecord({ id, tableName, columnPrimary });
}
module.exports = {
  getAll,
  getOneRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};
