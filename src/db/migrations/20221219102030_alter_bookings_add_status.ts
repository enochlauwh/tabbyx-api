import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
		ALTER TABLE bookings
		ADD COLUMN cancelled_at DATETIME NULL AFTER created_at	
	`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
		ALTER TABLE bookings
		DROP COLUMN cancelled_at 
	`);
}
