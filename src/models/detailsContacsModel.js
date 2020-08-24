const connection = require("../database/connection");
const tableName = "details_contacts";
const columnPrimary = "id";

const crud = require("./crudGeneric");

async function getDetailsOneContact(phone, limit = 5) {
  return connection(tableName)
    .select("*")
    .where("phone_contact", "=", phone)
    .orderBy("date", "desc")
    .limit(limit);
}

async function getDetailsAllContact() {
  return connection(tableName)
    .join("contacts", "details_contacts.phone_contact", "=", "contacts.phone")
    .select(["details_contacts.*", "contacts.*"]);
}

async function creatRecord(data) {
  return crud.createRecord(data, tableName);
}

async function updateRecord(data, id) {
  return crud.updateRecord({ id, data, tableName, columnPrimary });
}

async function deleteRecord(id) {
  return crud.deleteRecord({ id, tableName, columnPrimary });
}

async function deleteRecordByPhone(phone) {
  return connection(tableName).where("phone_contact", "=", phone).delete();
}

module.exports = {
  getDetailsOneContact,
  getDetailsAllContact,
  creatRecord,
  updateRecord,
  deleteRecord,
  deleteRecordByPhone,
};
