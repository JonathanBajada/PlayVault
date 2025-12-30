import { pool } from '../db';

export async function seedBinderCards() {
	// 1️⃣ get a binder
	const { rows: binders } = await pool.query('SELECT id FROM binders LIMIT 1');

	if (binders.length === 0) {
		throw new Error('No binders found');
	}

	const binderId = binders[0].id;

	// 2️⃣ get cards
	const { rows: cards } = await pool.query('SELECT id FROM cards LIMIT 10');

	if (cards.length === 0) {
		throw new Error('No cards found');
	}

	// 3️⃣ insert join rows
	for (const card of cards) {
		await pool.query(
			`
      INSERT INTO binder_cards (binder_id, card_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
			[binderId, card.id],
		);
	}

	console.log(`Seeded ${cards.length} binder_cards`);
}
