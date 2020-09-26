import { Router } from 'express'
import contactsController from '../controllers/contacts.controller'

const routes = Router()

routes.get('/summary', contactsController.getSummaryContacts)
routes.get('/', contactsController.get)
routes.get('/:id', contactsController.getOne)
routes.post('/', contactsController.create)
routes.post('/assign', contactsController.assign)
routes.delete('/assign', contactsController.cancelAssign)
routes.put('/:id', contactsController.update)
routes.delete('/:id', contactsController.deleteOne)

export default routes
