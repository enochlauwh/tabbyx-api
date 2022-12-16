import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
		CREATE TABLE bookings (
			id VARCHAR(7) NOT NULL,
			start_date DATETIME NOT NULL,
			end_date DATETIME NOT NULL,
			created_at DATETIME NOT NULL,
			created_by INT(10) UNSIGNED NOT NULL,
			PRIMARY KEY (id),
			FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
		);	
	`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
		DROP TABLE bookings;
	`);
}
