const express = require("express");

const contactsControllers = require("./controllers/contactsController");
const publishersControllers = require("./controllers/publishersController");
const statusControllers = require("./controllers/statusController");
const detailsContacsControllers = require("./controllers/detailsContactsController");
const languageControllers = require("./controllers/languageController");

const routes = express.Router();

routes.get("/contacts", contactsControllers.get);
routes.get("/contacts/:id", contactsControllers.getOne);
routes.post("/contacts", contactsControllers.create);
routes.put("/contacts/:id", contactsControllers.update);
routes.delete("/contacts/:id", contactsControllers.deleteOne);

routes.get("/publishers", publishersControllers.get);
routes.get("/publishers/:id", publishersControllers.getOne);
routes.post("/publishers", publishersControllers.create);
routes.put("/publishers/:id", publishersControllers.update);
routes.delete("/publishers/:id", publishersControllers.deleteOne);

routes.get("/status", statusControllers.get);
routes.post("/status", statusControllers.create);
routes.put("/status/:id", statusControllers.update);
routes.delete("/status/:id", statusControllers.deleteOne);

routes.get("/detailscontacts", detailsContacsControllers.get);
routes.get("/detailscontacts/:id", detailsContacsControllers.getOne);
routes.post("/detailscontacts/:id", detailsContacsControllers.create);
routes.put("/detailscontacts/:id", detailsContacsControllers.update);
routes.delete("/detailscontacts/:id", detailsContacsControllers.deleteOne);

routes.get("/language", languageControllers.get);
routes.post("/language", languageControllers.create);
routes.put("/language/:id", languageControllers.update);
routes.delete("/language/:id", languageControllers.deleteOne);
module.exports = routes;
