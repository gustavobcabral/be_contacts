const tableName = "language";
const columnPrimary = "id";

const crud = require("./crudGeneric");

async function getAll() {
  return crud.getAll(tableName);
}

async function createRecord(data) {
  return crud.createRecord(data, tableName);
}

async function updateRecord(id, data) {
  return crud.updateRecord({ id, data, tableName, columnPrimary });
}

//Nao deleta se tiver linkado com outra tabela, NORMAL ?
async function deleteRecord(id) {
  return crud.deleteRecord({ id, tableName, columnPrimary });
}
module.exports = { getAll, createRecord, updateRecord, deleteRecord };
