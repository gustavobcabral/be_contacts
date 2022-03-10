/* eslint-disable security/detect-object-injection */
const setupKnexPaginator = require('./knexPaginator')
const env = process.env.NODE_ENV || 'development'
const knexfile = require('./knexfile')
var types = require('pg').types;
// override parsing date column to Date()
types.setTypeParser(1082, val => val); 
const knex = require('knex')(knexfile[env])
setupKnexPaginator(knex)
module.exports = knex
