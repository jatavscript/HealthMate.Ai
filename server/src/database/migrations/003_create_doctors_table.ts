import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('doctors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('license_number').unique().notNullable();
    table.string('specialty').notNullable();
    table.string('hospital_affiliation');
    table.text('bio');
    table.integer('years_experience').defaultTo(0);
    table.json('education').defaultTo('[]');
    table.json('certifications').defaultTo('[]');
    table.json('languages').defaultTo('["English"]');
    table.decimal('rating', 3, 2).defaultTo(5.0);
    table.integer('reviews_count').defaultTo(0);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at');
    table.uuid('verified_by').references('id').inTable('users');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['license_number']);
    table.index(['specialty']);
    table.index(['is_verified']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('doctors');
}