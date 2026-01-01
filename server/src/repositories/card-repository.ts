import { pool } from '../db';

type CardFilters = {
	search?: string;
	rarity?: string;
	set?: string;
};

export async function getCards(
	page: number,
	limit: number,
	filters: CardFilters,
) {
	const safeLimit = Math.min(limit, 20);
	const offset = (page - 1) * safeLimit;

	const conditions: string[] = [];
	const values: any[] = [];

	// SEARCH (name)
	if (filters.search) {
		values.push(`%${filters.search}%`);
		conditions.push(`name ILIKE $${values.length}`);
	}

	// RARITY
	if (filters.rarity) {
		values.push(filters.rarity);
		conditions.push(`rarity = $${values.length}`);
	}

	// SET
	if (filters.set) {
		values.push(filters.set);
		conditions.push(`set_name = $${values.length}`);
	}

	const whereClause =
		conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	// Data query
	const dataQuery = `
		SELECT id, name, set_name, rarity, image_small_url
		FROM cards
		${whereClause}
		ORDER BY name
		LIMIT $${values.length + 1}
		OFFSET $${values.length + 2}
	`;

	// Count query
	const countQuery = `
		SELECT COUNT(*) FROM cards
		${whereClause}
	`;

	const dataPromise = pool.query(dataQuery, [...values, safeLimit, offset]);

	const countPromise = pool.query(countQuery, values);

	const [dataResult, countResult] = await Promise.all([
		dataPromise,
		countPromise,
	]);

	return {
		cards: dataResult.rows,
		total: Number(countResult.rows[0].count),
	};
}

export async function getUniqueSets() {
	const result = await pool.query(
		`SELECT DISTINCT set_name 
		FROM cards 
		WHERE set_name IS NOT NULL 
		ORDER BY set_name`,
	);

	return result.rows.map((row) => row.set_name);
}

export async function getUniqueRarities() {
	const result = await pool.query(
		`SELECT DISTINCT rarity 
		FROM cards 
		WHERE rarity IS NOT NULL 
		ORDER BY rarity`,
	);

	return result.rows.map((row) => row.rarity);
}
