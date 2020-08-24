import express from 'express'
import routes from './routes'
import bodyParser from 'body-parser'
import errorHandler from '../src/helpers/error.middleware'
const app = express()
const PORT = process.env.PORT || 3333

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(routes)
  .use(errorHandler)
  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.info(`Server started on port ${PORT} 🚀`)
  })
  .on('error', err => {
    // eslint-disable-next-line no-console
    console.error(err)
  })

export default app
