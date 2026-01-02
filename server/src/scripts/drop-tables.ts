import { pool } from '../db';
import * as fs from 'fs';
import * as path from 'path';

async function dropTables() {
	const client = await pool.connect();

	try {
		console.log('Dropping all existing tables...');

		// Read and execute the drop script
		const dropScriptPath = path.join(
			__dirname,
			'../db/drop-tables.sql',
		);
		const dropScript = fs.readFileSync(dropScriptPath, 'utf-8');

		await client.query(dropScript);

		console.log('✅ All tables dropped successfully');
	} catch (error) {
		console.error('❌ Error dropping tables:', error);
		throw error;
	} finally {
		client.release();
		process.exit(0);
	}
}

dropTables().catch(console.error);

