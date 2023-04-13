import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Users', (table) => {
    table.decimal('total_meals')
    table.decimal('noDiet_meals').after('total_meals')
    table.decimal('diet_meals').after('noDiet_meals')
  })
}

export async function down(knex: Knex): Promise<void> {}
