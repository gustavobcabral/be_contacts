import { Router } from 'express'
import authGuard from './helpers/authGuard.middleware'
import contacts from './routes/contacts'
import publishers from './routes/publishers'
import status from './routes/status'
import detailsContacts from './routes/detailsContacts'
import languages from './routes/languages'
import auth from './routes/auth'
import { permissionGuard } from './helpers/permissions.middleware'
const routes = Router()

routes.use('/auth', auth)
routes.use('/contacts', authGuard, permissionGuard, contacts)
routes.use('/publishers', publishers)
routes.use('/status', status)
routes.use('/detailsContacts', detailsContacts)
routes.use('/languages', languages)

export default routes
