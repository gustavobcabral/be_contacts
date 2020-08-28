import { Router } from 'express'
import authGuard from './shared/middleware/authGuard.middleware'
import contacts from './routes/contacts.route'
import publishers from './routes/publishers.route'
import status from './routes/status.route'
import detailsContacts from './routes/detailsContacts.route'
import languages from './routes/languages.route'
import auth from './routes/auth.route'
import { permissionGuard } from './shared/middleware/permissions.middleware'

const routes = Router()

routes.use('/auth', auth)
routes.use('/contacts', authGuard, permissionGuard, contacts)
routes.use('/publishers', publishers)
routes.use('/status', status)
routes.use('/detailsContacts', detailsContacts)
routes.use('/languages', languages)

export default routes
