exports.up = async function(knex) {
  await knex.schema.raw(`DROP VIEW "viewListAllContacts"`)

  return knex.schema.raw(`CREATE OR REPLACE VIEW "viewListAllContacts" AS ?`, [
    knex
      .select(
        'contacts.name',
        'contacts.owner',
        'contacts.phone',
        'contacts.idStatus',
        'contacts.idLanguage',
        'contacts.gender',
        'contacts.typeCompany',
        'contacts.idLocation',
        'cities.name as locationName',
        'departments.name as departmentName',
        'contacts.email',
        'contacts.note',
        'languages.name as languageName',
        'status.description as statusDescription',
        'dc.createdAtDetailsContacts',
        knex.raw(
          'COALESCE(dc."lastConversationInDays",99999999999) as "lastConversationInDays"'
        ),
        'dc.publisherName',
        knex.raw(
          `CASE 
            WHEN "dc"."information" = '[WAITING_FEEDBACK]' THEN true
            ELSE false
          END as "waitingFeedback"
          `
        ),
        'dc.information'
      )
      .from('contacts')
      .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
      .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
      .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
      .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
      .joinRaw(
        `LEFT JOIN lateral (
        SELECT 
          "phoneContact", 
          "publishers"."name" as "publisherName", 
          "detailsContacts"."createdAt" as "createdAtDetailsContacts", 
          DATE_PART('day', now() - "detailsContacts"."createdAt") as "lastConversationInDays",
          "detailsContacts"."information"
        FROM "detailsContacts"
        LEFT JOIN publishers on publishers.id = "detailsContacts"."idPublisher"
        WHERE "detailsContacts"."phoneContact" = contacts.phone
        ORDER BY "detailsContacts"."createdAt" DESC
        LIMIT 1) as dc ON contacts.phone = dc."phoneContact"`
      )
      .orderBy('contacts.phone')
  ])
}

exports.down = function(knex) {
  return knex.schema.raw(`DROP VIEW "viewListAllContacts"`)
}
