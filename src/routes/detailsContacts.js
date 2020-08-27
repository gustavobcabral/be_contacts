import { Router } from 'express'
import detailsContactsController from '../controllers/detailsContactsController'

const routes = Router()

routes.get('/', detailsContactsController.get)
routes.get('/:id', detailsContactsController.getOne)
routes.post('/', detailsContactsController.create)
routes.put('/:id', detailsContactsController.update)
routes.delete('/:id', detailsContactsController.deleteOne)

export default routes
