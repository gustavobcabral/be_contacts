import { Router } from 'express'
import detailsContactsController from '../controllers/detailsContacts.controller'

const routes = Router()

routes.get('/', detailsContactsController.get)
routes.post('/', detailsContactsController.create)
routes.put('/:id', detailsContactsController.update)
routes.delete('/:id', detailsContactsController.deleteOne)

export default routes