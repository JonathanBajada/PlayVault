import { pool } from '../db';

type CardFilters = {
	search?: string;
	rarity?: string;
	set?: string;
	cardType?: string; // supertype: Pokémon, Trainer, Energy
};

export async function getCards(
	page: number,
	limit: number,
	filters: CardFilters,
) {
	const safeLimit = Math.min(limit, 100); // Increased limit
	const offset = (page - 1) * safeLimit;

	const conditions: string[] = [];
	const values: any[] = [];

	// SEARCH (name)
	if (filters.search) {
		values.push(`%${filters.search}%`);
		conditions.push(`c.name ILIKE $${values.length}`);
	}

	// RARITY
	if (filters.rarity) {
		values.push(filters.rarity);
		conditions.push(`c.rarity = $${values.length}`);
	}

	// SET (filter by set name)
	if (filters.set) {
		values.push(filters.set);
		conditions.push(`s.name = $${values.length}`);
	}

	// CARD TYPE (supertype)
	if (filters.cardType) {
		values.push(filters.cardType);
		conditions.push(`c.supertype = $${values.length}`);
	}

	const whereClause =
		conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	// Data query - JOIN with sets table to get set name and calculate highest price
	const dataQuery = `
		SELECT 
			c.id,
			c.name,
			s.name AS set_name,
			c.rarity,
			c.image_small AS image_small_url,
			c.image_large AS image_large_url,
			c.supertype,
			c.number,
			c.hp,
			c.artist,
			COALESCE(MAX(p.high), 0) AS highest_price
		FROM cards c
		INNER JOIN sets s ON c.set_id = s.id
		LEFT JOIN prices p ON c.id = p.card_id
		${whereClause}
		GROUP BY c.id, c.name, s.name, c.rarity, c.image_small, c.image_large, c.supertype, c.number, c.hp, c.artist
		ORDER BY c.name
		LIMIT $${values.length + 1}
		OFFSET $${values.length + 2}
	`;

	// Count query
	const countQuery = `
		SELECT COUNT(*) 
		FROM cards c
		INNER JOIN sets s ON c.set_id = s.id
		${whereClause}
	`;

	const dataPromise = pool.query(dataQuery, [...values, safeLimit, offset]);
	const countPromise = pool.query(countQuery, values);

	const [dataResult, countResult] = await Promise.all([
		dataPromise,
		countPromise,
	]);

	// Convert highest_price from string to number (PostgreSQL NUMERIC returns as string)
	const cards = dataResult.rows.map((card) => ({
		...card,
		highest_price: card.highest_price ? Number(card.highest_price) : 0,
	}));

	return {
		cards,
		total: Number(countResult.rows[0].count),
	};
}

export async function getUniqueSets() {
	const result = await pool.query(
		`SELECT name 
		FROM sets 
		ORDER BY name`,
	);

	return result.rows.map((row) => row.name);
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

export async function getUniqueCardTypes() {
	const result = await pool.query(
		`SELECT DISTINCT supertype 
		FROM cards 
		WHERE supertype IS NOT NULL 
		ORDER BY supertype`,
	);

	return result.rows.map((row) => row.supertype);
}

// New function to get a single card by ID with all details
export async function getCardById(id: string) {
	const cardResult = await pool.query(
		`
		SELECT 
			c.id,
			c.name,
			c.number,
			c.rarity,
			c.supertype,
			c.hp,
			c.level,
			c.artist,
			c.flavor_text,
			c.evolves_from,
			c.converted_retreat_cost,
			c.legality_unlimited,
			c.legality_expanded,
			c.image_small AS image_small_url,
			c.image_large AS image_large_url,
			s.name AS set_name,
			s.series AS set_series,
			s.release_date AS set_release_date
		FROM cards c
		INNER JOIN sets s ON c.set_id = s.id
		WHERE c.id = $1
		`,
		[id],
	);

	if (cardResult.rows.length === 0) {
		return null;
	}

	const card = cardResult.rows[0];

	// Get types
	const typesResult = await pool.query(
		`SELECT type FROM card_types WHERE card_id = $1 ORDER BY type`,
		[id],
	);

	// Get subtypes
	const subtypesResult = await pool.query(
		`SELECT subtype FROM card_subtypes WHERE card_id = $1 ORDER BY subtype`,
		[id],
	);

	// Get attacks with costs
	const attacksResult = await pool.query(
		`
		SELECT 
			a.id,
			a.name,
			a.damage,
			a.text,
			a.converted_energy_cost,
			a.attack_order,
			COALESCE(
				json_agg(
					ac.energy_type ORDER BY ac.cost_order
				) FILTER (WHERE ac.energy_type IS NOT NULL),
				'[]'::json
			) AS cost
		FROM attacks a
		LEFT JOIN attack_costs ac ON a.id = ac.attack_id
		WHERE a.card_id = $1
		GROUP BY a.id, a.name, a.damage, a.text, a.converted_energy_cost, a.attack_order
		ORDER BY a.attack_order
		`,
		[id],
	);

	// Get abilities
	const abilitiesResult = await pool.query(
		`
		SELECT name, text, type
		FROM abilities
		WHERE card_id = $1
		ORDER BY ability_order
		`,
		[id],
	);

	// Get weaknesses
	const weaknessesResult = await pool.query(
		`SELECT type, value FROM card_weaknesses WHERE card_id = $1`,
		[id],
	);

	// Get resistances
	const resistancesResult = await pool.query(
		`SELECT type, value FROM card_resistances WHERE card_id = $1`,
		[id],
	);

	// Get pokedex numbers
	const pokedexResult = await pool.query(
		`SELECT pokedex_number FROM card_pokedex_numbers WHERE card_id = $1 ORDER BY pokedex_number`,
		[id],
	);

	// Get prices
	const pricesResult = await pool.query(
		`
		SELECT source, variant, low, mid, high, market, direct_low, updated_at
		FROM prices
		WHERE card_id = $1
		ORDER BY source, variant
		`,
		[id],
	);

	return {
		...card,
		types: typesResult.rows.map((r) => r.type),
		subtypes: subtypesResult.rows.map((r) => r.subtype),
		attacks: attacksResult.rows.map((a) => ({
			name: a.name,
			cost: a.cost,
			damage: a.damage,
			text: a.text,
			convertedEnergyCost: a.converted_energy_cost,
		})),
		abilities: abilitiesResult.rows.map((a) => ({
			name: a.name,
			text: a.text,
			type: a.type,
		})),
		weaknesses: weaknessesResult.rows,
		resistances: resistancesResult.rows,
		nationalPokedexNumbers: pokedexResult.rows.map((r) => r.pokedex_number),
		prices: pricesResult.rows,
	};
}
