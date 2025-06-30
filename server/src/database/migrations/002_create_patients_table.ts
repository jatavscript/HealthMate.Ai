import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('patients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('assigned_doctor_id').references('id').inTable('users');
    table.decimal('weight', 5, 2);
    table.decimal('height', 5, 2);
    table.string('blood_type');
    table.text('medical_history');
    table.text('allergies');
    table.text('current_medications');
    table.text('emergency_contact_name');
    table.string('emergency_contact_phone');
    table.string('emergency_contact_relationship');
    table.string('insurance_provider');
    table.string('insurance_number');
    table.enum('recovery_stage', ['acute', 'early', 'intermediate', 'advanced', 'maintenance']).defaultTo('early');
    table.date('surgery_date');
    table.string('condition');
    table.integer('adherence_rate').defaultTo(100);
    table.enum('risk_level', ['low', 'medium', 'high']).defaultTo('low');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['user_id']);
    table.index(['assigned_doctor_id']);
    table.index(['recovery_stage']);
    table.index(['risk_level']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('patients');
}