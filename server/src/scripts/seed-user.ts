import { pool } from '../db';

export async function seedUsers() {
	const result = await pool.query(
		`
    INSERT INTO users (email, username)
    VALUES ($1, $2)
    ON CONFLICT (email) DO NOTHING
    RETURNING id
    `,
		['demo@pokevault.dev', 'demo_user'],
	);

	if (result.rows.length > 0) {
		console.log('Seeded demo user:', result.rows[0].id);
		return result.rows[0].id;
	}

	const existing = await pool.query('SELECT id FROM users WHERE email = $1', [
		'demo@pokevault.dev',
	]);

	return existing.rows[0].id;
}
