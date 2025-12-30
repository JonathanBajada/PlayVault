import { pool } from '../db';

export async function seedBinders() {
	// Get an existing user
	const { rows: users } = await pool.query('SELECT id FROM users LIMIT 1');

	if (users.length === 0) {
		throw new Error('No users found. Run seedUsers first.');
	}

	const userId = users[0].id;

	const { rows } = await pool.query(
		`
    INSERT INTO binders (user_id, name)
    VALUES ($1, $2)
    RETURNING id
    `,
		[userId, 'My First Binder'],
	);

	console.log('Seeded binder:', rows[0].id);
	return rows[0].id;
}
