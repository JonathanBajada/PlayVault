import { pool } from '../db';
import * as fs from 'fs';
import * as path from 'path';

async function createSchema() {
	const client = await pool.connect();

	try {
		console.log('Creating database schema...');

		// Read and execute the schema script
		const schemaPath = path.join(__dirname, '../db/schema.sql');
		const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

		await client.query(schemaSQL);

		console.log('✅ Schema created successfully');
	} catch (error) {
		console.error('❌ Error creating schema:', error);
		throw error;
	} finally {
		client.release();
		process.exit(0);
	}
}

createSchema().catch(console.error);

