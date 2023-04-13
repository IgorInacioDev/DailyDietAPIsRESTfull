import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Meals', (table) => {
    table.uuid('id').primary().notNullable()
    table.uuid('session_id').after('id')
    table.text('name').notNullable().after('session_id')
    table.text('description').notNullable().after('name')
    table.text('type').notNullable().after('description')
    table.timestamp('create_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Meals')
}
