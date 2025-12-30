import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import pool from '../src/db/connection';

// Load environment variables
dotenv.config();

interface CardIndexEntry {
	id: string;
	name: string;
	set?: string;
	rarity?: string;
	images?: {
		small: string;
	};
}

async function seedCards() {
	const cardsIndexPath = path.join(__dirname, '../data/cards-index.json');

	// Check if cards-index.json exists
	if (!fs.existsSync(cardsIndexPath)) {
		console.error(
			`❌ Error: cards-index.json not found at ${cardsIndexPath}`,
		);
		console.log(
			'💡 Run "npm run populate-cards-index" first to generate the cards index.',
		);
		process.exit(1);
	}

	// Read cards from JSON file
	console.log('📖 Reading cards from cards-index.json...');
	const cardsData = fs.readFileSync(cardsIndexPath, 'utf-8');
	const cards: CardIndexEntry[] = JSON.parse(cardsData);

	console.log(`📦 Found ${cards.length} cards to seed`);

	// Test database connection
	try {
		await pool.query('SELECT NOW()');
		console.log('✅ Database connection successful');
	} catch (error) {
		console.error('❌ Database connection failed:', error);
		console.log(
			'\n💡 Make sure PostgreSQL is running and your .env file has the correct database credentials.',
		);
		console.log(
			'   Example .env variables:\n   DB_HOST=localhost\n   DB_PORT=5432\n   DB_NAME=playvault\n   DB_USER=postgres\n   DB_PASSWORD=your_password',
		);
		process.exit(1);
	}

	// Create schema if it doesn't exist
	console.log('📋 Creating database schema...');
	const schemaPath = path.join(__dirname, '../src/db/schema.sql');
	const schema = fs.readFileSync(schemaPath, 'utf-8');
	await pool.query(schema);
	console.log('✅ Schema created/verified');

	// Clear existing cards (optional - comment out if you want to keep existing data)
	console.log('🗑️  Clearing existing cards...');
	await pool.query('TRUNCATE TABLE cards CASCADE');
	console.log('✅ Existing cards cleared');

	// Insert cards in batches
	const batchSize = 100;
	let inserted = 0;
	let errors = 0;

	console.log(
		`\n🌱 Seeding ${cards.length} cards in batches of ${batchSize}...`,
	);

	for (let i = 0; i < cards.length; i += batchSize) {
		const batch = cards.slice(i, i + batchSize);
		const values: any[] = [];
		const placeholders: string[] = [];

		batch.forEach((card, index) => {
			const baseIndex = index * 5;
			placeholders.push(
				`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${
					baseIndex + 4
				}, $${baseIndex + 5})`,
			);
			values.push(
				card.id,
				card.name,
				card.set || null,
				card.rarity || null,
				card.images?.small || null,
			);
		});

		const query = `
			INSERT INTO cards (id, name, set_name, rarity, image_small_url)
			VALUES ${placeholders.join(', ')}
			ON CONFLICT (id) DO UPDATE SET
				name = EXCLUDED.name,
				set_name = EXCLUDED.set_name,
				rarity = EXCLUDED.rarity,
				image_small_url = EXCLUDED.image_small_url,
				updated_at = CURRENT_TIMESTAMP
		`;

		try {
			await pool.query(query, values);
			inserted += batch.length;
			if ((i + batchSize) % 500 === 0 || i + batchSize >= cards.length) {
				console.log(
					`   Progress: ${Math.min(i + batchSize, cards.length)}/${
						cards.length
					} cards processed`,
				);
			}
		} catch (error: any) {
			console.error(
				`❌ Error inserting batch starting at index ${i}:`,
				error.message,
			);
			errors++;
		}
	}

	console.log(`\n✅ Seeding complete!`);
	console.log(`   ✅ Successfully inserted/updated: ${inserted} cards`);
	if (errors > 0) {
		console.log(`   ⚠️  Errors encountered: ${errors} batches`);
	}

	// Verify the count
	const result = await pool.query('SELECT COUNT(*) FROM cards');
	console.log(`   📊 Total cards in database: ${result.rows[0].count}`);

	await pool.end();
}

seedCards().catch((error) => {
	console.error('❌ Fatal error:', error);
	process.exit(1);
});
