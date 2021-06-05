import { graphqlHTTP } from 'express-graphql'
import schema from './contacts.schema'
import rootValue from './contacts.resolvers'
import { responseNext } from '../../shared/helpers/responseGeneric.helper'

async function createController(request, response) {
  return {
    schema,
    context: { request, response },
    rootValue,
    customFormatErrorFn: responseNext
  }
}

export default graphqlHTTP(createController)
