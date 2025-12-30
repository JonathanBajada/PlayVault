import fs from 'fs';
import path from 'path';
import { pool } from '../db';

export async function seedCards() {
	const filePath = path.join(__dirname, '../../data/cards.json');
	const raw = fs.readFileSync(filePath, 'utf-8');
	const cards = JSON.parse(raw);

	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		for (const card of cards) {
			await client.query(
				`
        INSERT INTO cards (id, name, set_name, rarity, image_small_url)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING
        `,
				[card.id, card.name, card.set, card.rarity, card.images.small],
			);
		}

		await client.query('COMMIT');
		console.log(`✅ Seeded ${cards.length} cards`);
	} catch (err) {
		await client.query('ROLLBACK');
		console.error('❌ Seeding failed', err);
	} finally {
		client.release();
		process.exit(0);
	}
}
