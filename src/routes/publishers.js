import { Router } from 'express'
import publishersController from '../controllers/publishersController'

const routes = Router()

routes.get('/', publishersController.get)
routes.get('/:id', publishersController.getOne)
routes.post('/', publishersController.create)
routes.put('/:id', publishersController.update)
routes.delete('/:id', publishersController.deleteOne)

export default routes
