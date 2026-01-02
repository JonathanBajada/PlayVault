import { pool } from '../db';
import * as fs from 'fs';
import * as path from 'path';

interface CardData {
	id: string;
	name: string;
	number: string;
	rarity: string;
	supertype: string;
	hp?: string;
	level?: string;
	artist?: string;
	flavorText?: string;
	types?: string[];
	subtypes?: string[];
	evolvesFrom?: string;
	evolvesTo?: string[];
	retreatCost?: string[];
	convertedRetreatCost?: number;
	attacks?: Array<{
		name: string;
		cost: string[];
		damage?: string;
		text?: string;
		convertedEnergyCost?: number;
	}>;
	abilities?: Array<{
		name: string;
		text: string;
		type?: string;
	}>;
	weaknesses?: Array<{
		type: string;
		value: string;
	}>;
	resistances?: Array<{
		type: string;
		value: string;
	}>;
	nationalPokedexNumbers?: number[];
	set: {
		id: string;
		name: string;
		series: string;
		printedTotal?: number;
		total?: number;
		ptcgoCode?: string;
		releaseDate: string;
		updatedAt?: string;
		images: {
			symbol?: string;
			logo?: string;
		};
	};
	images: {
		small: string;
		large: string;
	};
	legalities?: {
		unlimited?: string;
		expanded?: string;
	};
	tcgplayer?: {
		url?: string;
		updatedAt?: string;
		prices?: Record<
			string,
			{
				low?: number;
				mid?: number;
				high?: number;
				market?: number;
				directLow?: number | null;
			}
		>;
	};
	cardmarket?: {
		url?: string;
		updatedAt?: string;
		prices?: {
			averageSellPrice?: number;
			lowPrice?: number;
			trendPrice?: number;
			germanProLow?: number;
			suggestedPrice?: number;
			reverseHoloSell?: number;
			reverseHoloLow?: number;
			reverseHoloTrend?: number;
			lowPriceExPlus?: number;
			avg1?: number;
			avg7?: number;
			avg30?: number;
			reverseHoloAvg1?: number;
			reverseHoloAvg7?: number;
			reverseHoloAvg30?: number;
		};
	};
}

async function seedNewSchema() {
	const filePath = path.join(__dirname, '../../data/cards2.json');
	const raw = fs.readFileSync(filePath, 'utf-8');
	const data = JSON.parse(raw);
	const cards: CardData[] = data.data || [];

	console.log(`Loading ${cards.length} cards from cards2.json...`);

	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		// Step 1: Collect unique sets and insert them
		const setsMap = new Map<string, CardData['set']>();
		for (const card of cards) {
			if (!setsMap.has(card.set.id)) {
				setsMap.set(card.set.id, card.set);
			}
		}

		console.log(`Inserting ${setsMap.size} unique sets...`);
		for (const [setId, setData] of setsMap) {
			await client.query(
				`
				INSERT INTO sets (
					id, name, series, printed_total, total, ptcgo_code,
					release_date, updated_at, symbol_image, logo_image
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
				ON CONFLICT (id) DO UPDATE SET
					name = EXCLUDED.name,
					series = EXCLUDED.series,
					printed_total = EXCLUDED.printed_total,
					total = EXCLUDED.total,
					ptcgo_code = EXCLUDED.ptcgo_code,
					release_date = EXCLUDED.release_date,
					updated_at = EXCLUDED.updated_at,
					symbol_image = EXCLUDED.symbol_image,
					logo_image = EXCLUDED.logo_image
				`,
				[
					setId,
					setData.name,
					setData.series,
					setData.printedTotal || null,
					setData.total || null,
					setData.ptcgoCode || null,
					setData.releaseDate || null,
					setData.updatedAt ? new Date(setData.updatedAt) : null,
					setData.images.symbol || null,
					setData.images.logo || null,
				],
			);
		}

		// Step 2: Insert cards
		console.log(`Inserting ${cards.length} cards...`);
		let cardsInserted = 0;
		for (const card of cards) {
			await client.query(
				`
				INSERT INTO cards (
					id, name, number, rarity, supertype, hp, level, artist, flavor_text,
					set_id, image_small, image_large, evolves_from, converted_retreat_cost,
					legality_unlimited, legality_expanded
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
				ON CONFLICT (id) DO UPDATE SET
					name = EXCLUDED.name,
					number = EXCLUDED.number,
					rarity = EXCLUDED.rarity,
					supertype = EXCLUDED.supertype,
					hp = EXCLUDED.hp,
					level = EXCLUDED.level,
					artist = EXCLUDED.artist,
					flavor_text = EXCLUDED.flavor_text,
					set_id = EXCLUDED.set_id,
					image_small = EXCLUDED.image_small,
					image_large = EXCLUDED.image_large,
					evolves_from = EXCLUDED.evolves_from,
					converted_retreat_cost = EXCLUDED.converted_retreat_cost,
					legality_unlimited = EXCLUDED.legality_unlimited,
					legality_expanded = EXCLUDED.legality_expanded,
					updated_at = now()
				`,
				[
					card.id,
					card.name,
					card.number,
					card.rarity,
					card.supertype,
					card.hp || null,
					card.level || null,
					card.artist || null,
					card.flavorText || null,
					card.set.id,
					card.images.small,
					card.images.large,
					card.evolvesFrom || null,
					card.convertedRetreatCost || null,
					card.legalities?.unlimited || null,
					card.legalities?.expanded || null,
				],
			);
			cardsInserted++;
			if (cardsInserted % 100 === 0) {
				console.log(`  Inserted ${cardsInserted} cards...`);
			}
		}

		// Step 3: Insert card_types
		console.log('Inserting card types...');
		let typesInserted = 0;
		for (const card of cards) {
			if (card.types && card.types.length > 0) {
				for (const type of card.types) {
					await client.query(
						`
						INSERT INTO card_types (card_id, type)
						VALUES ($1, $2)
						ON CONFLICT (card_id, type) DO NOTHING
						`,
						[card.id, type],
					);
					typesInserted++;
				}
			}
		}
		console.log(`  Inserted ${typesInserted} card type relationships`);

		// Step 4: Insert card_subtypes
		console.log('Inserting card subtypes...');
		let subtypesInserted = 0;
		for (const card of cards) {
			if (card.subtypes && card.subtypes.length > 0) {
				for (const subtype of card.subtypes) {
					await client.query(
						`
						INSERT INTO card_subtypes (card_id, subtype)
						VALUES ($1, $2)
						ON CONFLICT (card_id, subtype) DO NOTHING
						`,
						[card.id, subtype],
					);
					subtypesInserted++;
				}
			}
		}
		console.log(`  Inserted ${subtypesInserted} card subtype relationships`);

		// Step 5: Insert attacks and attack_costs
		console.log('Inserting attacks...');
		let attacksInserted = 0;
		for (const card of cards) {
			if (card.attacks && card.attacks.length > 0) {
				for (let i = 0; i < card.attacks.length; i++) {
					const attack = card.attacks[i];
					const attackResult = await client.query(
						`
						INSERT INTO attacks (
							card_id, name, damage, text, converted_energy_cost, attack_order
						)
						VALUES ($1, $2, $3, $4, $5, $6)
						RETURNING id
						`,
						[
							card.id,
							attack.name,
							attack.damage || null,
							attack.text || null,
							attack.convertedEnergyCost || null,
							i,
						],
					);
					const attackId = attackResult.rows[0].id;

					// Insert attack costs
					if (attack.cost && attack.cost.length > 0) {
						for (let j = 0; j < attack.cost.length; j++) {
							await client.query(
								`
								INSERT INTO attack_costs (attack_id, energy_type, cost_order)
								VALUES ($1, $2, $3)
								ON CONFLICT (attack_id, energy_type, cost_order) DO NOTHING
								`,
								[attackId, attack.cost[j], j],
							);
						}
					}
					attacksInserted++;
				}
			}
		}
		console.log(`  Inserted ${attacksInserted} attacks`);

		// Step 6: Insert abilities
		console.log('Inserting abilities...');
		let abilitiesInserted = 0;
		for (const card of cards) {
			if (card.abilities && card.abilities.length > 0) {
				for (let i = 0; i < card.abilities.length; i++) {
					const ability = card.abilities[i];
					await client.query(
						`
						INSERT INTO abilities (card_id, name, text, type, ability_order)
						VALUES ($1, $2, $3, $4, $5)
						`,
						[card.id, ability.name, ability.text, ability.type || null, i],
					);
					abilitiesInserted++;
				}
			}
		}
		console.log(`  Inserted ${abilitiesInserted} abilities`);

		// Step 7: Insert weaknesses
		console.log('Inserting weaknesses...');
		let weaknessesInserted = 0;
		for (const card of cards) {
			if (card.weaknesses && card.weaknesses.length > 0) {
				for (const weakness of card.weaknesses) {
					await client.query(
						`
						INSERT INTO card_weaknesses (card_id, type, value)
						VALUES ($1, $2, $3)
						ON CONFLICT (card_id, type) DO NOTHING
						`,
						[card.id, weakness.type, weakness.value],
					);
					weaknessesInserted++;
				}
			}
		}
		console.log(`  Inserted ${weaknessesInserted} weaknesses`);

		// Step 8: Insert resistances
		console.log('Inserting resistances...');
		let resistancesInserted = 0;
		for (const card of cards) {
			if (card.resistances && card.resistances.length > 0) {
				for (const resistance of card.resistances) {
					await client.query(
						`
						INSERT INTO card_resistances (card_id, type, value)
						VALUES ($1, $2, $3)
						ON CONFLICT (card_id, type) DO NOTHING
						`,
						[card.id, resistance.type, resistance.value],
					);
					resistancesInserted++;
				}
			}
		}
		console.log(`  Inserted ${resistancesInserted} resistances`);

		// Step 9: Insert pokedex numbers
		console.log('Inserting Pokédex numbers...');
		let pokedexInserted = 0;
		for (const card of cards) {
			if (
				card.nationalPokedexNumbers &&
				card.nationalPokedexNumbers.length > 0
			) {
				for (const pokedexNum of card.nationalPokedexNumbers) {
					await client.query(
						`
						INSERT INTO card_pokedex_numbers (card_id, pokedex_number)
						VALUES ($1, $2)
						ON CONFLICT (card_id, pokedex_number) DO NOTHING
						`,
						[card.id, pokedexNum],
					);
					pokedexInserted++;
				}
			}
		}
		console.log(`  Inserted ${pokedexInserted} Pokédex number relationships`);

		// Step 10: Insert prices (tcgplayer)
		console.log('Inserting TCGPlayer prices...');
		let tcgpricesInserted = 0;
		for (const card of cards) {
			if (card.tcgplayer?.prices) {
				for (const [variant, priceData] of Object.entries(
					card.tcgplayer.prices,
				)) {
					await client.query(
						`
						INSERT INTO prices (
							card_id, source, variant, low, mid, high, market, direct_low, updated_at
						)
						VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
						ON CONFLICT (card_id, source, variant) DO UPDATE SET
							low = EXCLUDED.low,
							mid = EXCLUDED.mid,
							high = EXCLUDED.high,
							market = EXCLUDED.market,
							direct_low = EXCLUDED.direct_low,
							updated_at = EXCLUDED.updated_at
						`,
						[
							card.id,
							'tcgplayer',
							variant,
							priceData.low || null,
							priceData.mid || null,
							priceData.high || null,
							priceData.market || null,
							priceData.directLow || null,
							card.tcgplayer.updatedAt
								? new Date(card.tcgplayer.updatedAt)
								: null,
						],
					);
					tcgpricesInserted++;
				}
			}
		}
		console.log(`  Inserted ${tcgpricesInserted} TCGPlayer price entries`);

		// Step 11: Insert prices (cardmarket)
		console.log('Inserting Cardmarket prices...');
		let cmPricesInserted = 0;
		for (const card of cards) {
			if (card.cardmarket?.prices) {
				const prices = card.cardmarket.prices;
				// Store cardmarket prices as a single variant with key fields
				// We'll store the most important fields
				await client.query(
					`
					INSERT INTO prices (
						card_id, source, variant, low, mid, market, updated_at
					)
					VALUES ($1, $2, $3, $4, $5, $6, $7)
					ON CONFLICT (card_id, source, variant) DO UPDATE SET
						low = EXCLUDED.low,
						mid = EXCLUDED.mid,
						market = EXCLUDED.market,
						updated_at = EXCLUDED.updated_at
					`,
					[
						card.id,
						'cardmarket',
						'standard',
						prices.lowPrice || null,
						prices.averageSellPrice || null,
						prices.trendPrice || null,
						card.cardmarket.updatedAt
							? new Date(card.cardmarket.updatedAt)
							: null,
					],
				);
				cmPricesInserted++;
			}
		}
		console.log(`  Inserted ${cmPricesInserted} Cardmarket price entries`);

		await client.query('COMMIT');
		console.log(`\n✅ Successfully seeded ${cards.length} cards with all related data`);
	} catch (err) {
		await client.query('ROLLBACK');
		console.error('❌ Seeding failed', err);
		throw err;
	} finally {
		client.release();
		process.exit(0);
	}
}

seedNewSchema().catch(console.error);

