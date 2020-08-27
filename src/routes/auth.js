import { Router } from 'express'
import authController from '../controllers/authController'

const routes = Router()

routes.get('/:email/:password', authController.authenticate)

export default routes
