import { graphqlHTTP } from 'express-graphql'
import schema from './contacts.schema'
import rootValueContact from './contacts.resolvers'
import { responseNext } from '../../shared/helpers/responseGeneric.helper'

import { resolvers as scalarResolvers } from 'graphql-scalars'

const rootValue = { ScalarName: scalarResolvers, ...rootValueContact }

async function createController(request, response) {
  return {
    schema,
    context: { request, response },
    rootValue,
    customFormatErrorFn: responseNext
  }
}

export default graphqlHTTP(createController)
