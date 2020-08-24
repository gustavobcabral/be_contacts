import { Router } from 'express'

import contactsControllers from './controllers/contactsController'
import publishersControllers from './controllers/publishersController'
import statusControllers from './controllers/statusController'
import detailsContactsControllers from './controllers/detailsContactsController'
import languagesControllers from './controllers/languagesController'

const routes = Router()

routes.get('/contacts', contactsControllers.get)
routes.get('/contacts/:id', contactsControllers.getOne)
routes.post('/contacts', contactsControllers.create)
routes.put('/contacts/:id', contactsControllers.update)
routes.delete('/contacts/:id', contactsControllers.deleteOne)

routes.get('/publishers', publishersControllers.get)
routes.get('/publishers/:id', publishersControllers.getOne)
routes.post('/publishers', publishersControllers.create)
routes.put('/publishers/:id', publishersControllers.update)
routes.delete('/publishers/:id', publishersControllers.deleteOne)

routes.get('/status', statusControllers.get)
routes.post('/status', statusControllers.create)
routes.put('/status/:id', statusControllers.update)
routes.delete('/status/:id', statusControllers.deleteOne)

routes.get('/detailscontacts', detailsContactsControllers.get)
routes.get('/detailscontacts/:id', detailsContactsControllers.getOne)
routes.post('/detailscontacts/:id', detailsContactsControllers.create)
routes.put('/detailscontacts/:id', detailsContactsControllers.update)
routes.delete('/detailscontacts/:id', detailsContactsControllers.deleteOne)

routes.get('/languages', languagesControllers.get)
routes.post('/languages', languagesControllers.create)
routes.put('/languages/:id', languagesControllers.update)
routes.delete('/languages/:id', languagesControllers.deleteOne)

export default routes
