import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('medications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('patient_id').references('id').inTable('patients').onDelete('CASCADE');
    table.uuid('prescribed_by').references('id').inTable('doctors');
    table.string('name').notNullable();
    table.string('dosage').notNullable();
    table.integer('frequency_per_day').notNullable();
    table.json('times').notNullable(); // Array of times like ["08:00", "20:00"]
    table.integer('duration_days');
    table.enum('duration_type', ['days', 'weeks', 'months', 'ongoing']).defaultTo('days');
    table.date('start_date').notNullable();
    table.date('end_date');
    table.text('instructions');
    table.json('side_effects').defaultTo('[]');
    table.enum('category', ['pain-relief', 'antibiotic', 'vitamin', 'supplement', 'chronic', 'other']).defaultTo('other');
    table.boolean('reminder_enabled').defaultTo(true);
    table.integer('reminder_minutes_before').defaultTo(15);
    table.enum('status', ['active', 'completed', 'discontinued']).defaultTo('active');
    table.text('notes');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['patient_id']);
    table.index(['prescribed_by']);
    table.index(['status']);
    table.index(['start_date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('medications');
}