import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('medication_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('medication_id').references('id').inTable('medications').onDelete('CASCADE');
    table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    table.timestamp('scheduled_time').notNullable();
    table.timestamp('taken_time');
    table.boolean('taken').defaultTo(false);
    table.enum('status', ['taken', 'missed', 'skipped', 'late']).defaultTo('missed');
    table.text('notes');
    table.json('side_effects_reported').defaultTo('[]');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['medication_id']);
    table.index(['patient_id']);
    table.index(['scheduled_time']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('medication_logs');
}