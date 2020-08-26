import { Router } from 'express'
import languagesController from '../controllers/languagesController'

const routes = Router()

routes.get('/', languagesController.get)
routes.post('/', languagesController.create)
routes.put('/:id', languagesController.update)
routes.delete('/:id', languagesController.deleteOne)

export default routes
