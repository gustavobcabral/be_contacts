exports.up = async function (knex) {
  await knex.schema.raw(`DROP VIEW "viewListAllContacts"`)
  const sql = knex
    .select(
      'contacts.name',
      'contacts.owner',
      'contacts.phone',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.gender',
      'contacts.typeCompany',
      'contacts.idLocation',
      'contacts.createdAt',
      'contacts.updatedAt',
      'cities.name as locationName',
      'departments.name as departmentName',
      'contacts.email',
      'contacts.note',
      'languages.name as languageName',
      'status.description as statusDescription',
      'dc.createdAt as createdAtDetailsContacts',
      'dc.updatedAt as updatedAtDetailsContacts',
      knex.raw(
        `CASE 
          WHEN "dc"."updatedAt" is NULL THEN 99999999999
          ELSE date_part('day', now() - "dc"."updatedAt")
        END as "lastConversationInDays"
        `
      ),
      'publishers.name as publisherName',
      'publisherCreatedBy.name as publisherNameCreatedBy',
      'publisherUpdatedBy.name as publisherNameUpdatedBy',
      knex.raw(
        `CASE 
          WHEN "dc"."information" = '[WAITING_FEEDBACK]' THEN true
          ELSE false
        END as "waitingFeedback"
        `
      ),
      'dc.information',
      'dc.idCampaign',
      'dc.id as idDetailContact',
      'campaigns.name as campaignName',
      'campaigns.dateStart as campaignDateStart',
      'campaigns.dateFinal as campaignDateFinal'
    )
    .from('contacts')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
    .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
    .leftJoin('detailsContacts as dc', function () {
      this.on('dc.phoneContact', '=', 'contacts.phone').on(
        'dc.isLast',
        '=',
        knex.raw('?', [true])
      )
    })
    .leftJoin('campaigns', 'campaigns.id', '=', 'dc.idCampaign')
    .leftJoin('publishers', 'publishers.id', '=', 'dc.idPublisher')
    .leftJoin(
      'publishers as publisherCreatedBy',
      'publisherCreatedBy.id',
      '=',
      'contacts.createdBy'
    )
    .leftJoin(
      'publishers as publisherUpdatedBy',
      'publisherUpdatedBy.id',
      '=',
      'contacts.updatedBy'
    )

  return knex.schema.raw(
    `CREATE OR REPLACE VIEW "viewListAllContacts" AS ${sql.toString()}`
  )
}

exports.down = async function (knex) {
  await knex.schema.raw(`DROP VIEW "viewListAllContacts"`)
  const sql = knex
    .select(
      'contacts.name',
      'contacts.owner',
      'contacts.phone',
      'contacts.idStatus',
      'contacts.idLanguage',
      'contacts.gender',
      'contacts.typeCompany',
      'contacts.idLocation',
      'contacts.createdAt',
      'contacts.updatedAt',
      'cities.name as locationName',
      'departments.name as departmentName',
      'contacts.email',
      'contacts.note',
      'languages.name as languageName',
      'status.description as statusDescription',
      'dc.createdAt as createdAtDetailsContacts',
      knex.raw(
        `COALESCE(date_part('day'::text, now() - "dc"."updatedAt"),99999999999) as "lastConversationInDays"`
      ),
      'publishers.name as publisherName',
      'publisherCreatedBy.name as publisherNameCreatedBy',
      'publisherUpdatedBy.name as publisherNameUpdatedBy',
      knex.raw(
        `CASE 
          WHEN "dc"."information" = '[WAITING_FEEDBACK]' THEN true
          ELSE false
        END as "waitingFeedback"
        `
      ),
      'dc.information',
      'dc.idCampaign',
      'dc.id as idDetailContact',
      'campaigns.name as campaignName',
      'campaigns.dateStart as campaignDateStart',
      'campaigns.dateFinal as campaignDateFinal'
    )
    .from('contacts')
    .leftJoin('languages', 'languages.id', '=', 'contacts.idLanguage')
    .leftJoin('status', 'status.id', '=', 'contacts.idStatus')
    .leftJoin('cities', 'cities.id', '=', 'contacts.idLocation')
    .leftJoin('departments', 'departments.id', '=', 'cities.idDepartment')
    .leftJoin('detailsContacts as dc', function () {
      this.on('dc.phoneContact', '=', 'contacts.phone').on(
        'dc.isLast',
        '=',
        knex.raw('?', [true])
      )
    })
    .leftJoin('campaigns', 'campaigns.id', '=', 'dc.idCampaign')
    .leftJoin('publishers', 'publishers.id', '=', 'dc.idPublisher')
    .leftJoin(
      'publishers as publisherCreatedBy',
      'publisherCreatedBy.id',
      '=',
      'contacts.createdBy'
    )
    .leftJoin(
      'publishers as publisherUpdatedBy',
      'publisherUpdatedBy.id',
      '=',
      'contacts.updatedBy'
    )

  return knex.schema.raw(
    `CREATE OR REPLACE VIEW "viewListAllContacts" AS ${sql.toString()}`
  )
}
