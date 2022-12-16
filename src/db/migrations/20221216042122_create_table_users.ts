import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
		CREATE TABLE users (
			id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			PRIMARY KEY (id)
		);
	
	`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
		DROP TABLE users;	
	`);
}
