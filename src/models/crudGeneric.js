const connection = require("../database/connection");

async function getAll(tableName) {
  return connection(tableName).select("*");
}

async function createRecord(data, tableName) {
  return connection(tableName).returning("*").insert(data);
}

async function updateRecord({ id, data, tableName, columnPrimary }) {
  return connection(tableName)
    .where(columnPrimary, id)
    .update(data, Object.keys(data));
}

//Nao deleta se tiver linkado com outra tabela, NORMAL ?
async function deleteRecord({ id, tableName, columnPrimary }) {
  return connection(tableName).where(columnPrimary, id).delete();
}
module.exports = { getAll, createRecord, updateRecord, deleteRecord };
