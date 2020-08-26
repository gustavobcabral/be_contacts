import { Router } from 'express'

import contacts from './routes/contacts'
import publishers from './routes/publishers'
import status from './routes/status'
import detailsContacts from './routes/detailsContacts'
import languages from './routes/languages'

const routes = Router()

routes.use('/contacts', contacts)
routes.use('/publishers', publishers)
routes.use('/status', status)
routes.use('/detailsContacts', detailsContacts)
routes.use('/languages', languages)

export default routes
