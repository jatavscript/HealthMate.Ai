import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.enum('role', ['patient', 'doctor', 'admin']).notNullable();
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.date('date_of_birth');
    table.enum('gender', ['male', 'female', 'other']);
    table.string('phone');
    table.text('address');
    table.string('profile_image_url');
    table.json('preferences').defaultTo('{}');
    table.timestamp('email_verified_at');
    table.timestamp('last_login_at');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['email']);
    table.index(['role']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}