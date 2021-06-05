import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './contacts.schema.graphql.js'

const schema = makeExecutableSchema({ typeDefs })
export default schema
