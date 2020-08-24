/* eslint-disable fp/no-mutation */

let KnexQueryBuilder
try {
  // import for the latest
  KnexQueryBuilder = require('knex/src/query/builder')
} catch (e) {
  // fallback to old knex version (that we are using)
  KnexQueryBuilder = require('knex/lib/query/builder')
}

const setupKnexPaginator = function(knex) {
  KnexQueryBuilder.prototype.paginate = async function(
    perPage = 10,
    currentPage = 1,
    getTotals = true
  ) {
    if (currentPage < 1) {
      currentPage = 1
    }

    const offset = (currentPage - 1) * perPage

    const [count, result] = await Promise.all([
      getTotals
        ? this.clone()
            .clearOrder()
            .count('* as total')
            .first()
        : Promise.resolve(),
      this.offset(offset).limit(perPage)
    ])
    const totals = getTotals
      ? {
          totalRows: count.total,
          lastPage: Math.ceil(count.total / perPage)
        }
      : {}

    const basicPagination = {
      perPage,
      currentPage,
      from: offset,
      to: offset + result.length
    }

    return {
      list: result,
      pagination: { ...basicPagination, ...totals }
    }
  }

  knex.queryBuilder = function queryBuilder() {
    return new KnexQueryBuilder(knex.client)
  }
}

module.exports = setupKnexPaginator
