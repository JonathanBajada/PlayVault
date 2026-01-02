import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const POKEMON_TCG_BASE_URL = 'https://api.pokemontcg.io/v2';
const API_KEY = process.env.POKEMON_TCG_API_KEY?.trim();
const OUTPUT_DIR = path.join(__dirname, '../../data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'cards2.json');

// Retry function with exponential backoff
async function fetchWithRetry(
	url: string,
	params: any,
	headers: any,
	maxRetries = 5,
): Promise<any> {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			const response = await axios.get(url, { params, headers });
			return response;
		} catch (error: any) {
			if (attempt === maxRetries) {
				throw error;
			}
			const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30 seconds
			console.log(
				`  Attempt ${attempt} failed, retrying in ${waitTime / 1000}s...`,
			);
			await new Promise((resolve) => setTimeout(resolve, waitTime));
		}
	}
	throw new Error('Max retries exceeded');
}

// Load existing data if file exists
function loadExistingData(): any[] {
	if (fs.existsSync(OUTPUT_FILE)) {
		try {
			const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
			return existing.data || [];
		} catch (error) {
			console.log('Could not load existing file, starting fresh');
			return [];
		}
	}
	return [];
}

// Save cards incrementally
function saveCardsIncremental(cards: any[]) {
	const outputData = {
		data: cards,
		totalCount: cards.length,
		lastUpdated: new Date().toISOString(),
	};
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
}

async function parseEnhancedCards() {
	console.log('Starting to fetch all cards from Pokemon TCG API...');

	// Load existing data if available
	const allCards = loadExistingData();
	const startPage =
		allCards.length > 0 ? Math.floor(allCards.length / 100) + 1 : 1;

	if (allCards.length > 0) {
		console.log(
			`Resuming from page ${startPage} (${allCards.length} cards already loaded)`,
		);
	}

	// Ensure output directory exists
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	let page = startPage;
	const pageSize = 100;
	let hasMore = true;
	let consecutiveFailures = 0;
	const maxConsecutiveFailures = 3;

	while (hasMore) {
		try {
			console.log(`Fetching page ${page}...`);

			const response = await fetchWithRetry(
				`${POKEMON_TCG_BASE_URL}/cards`,
				{ page, pageSize },
				API_KEY ? { 'X-Api-Key': API_KEY } : undefined,
			);

			const cards = response.data.data || [];

			if (cards.length === 0) {
				console.log('No more cards found, stopping...');
				hasMore = false;
				break;
			}

			// Add all cards as-is (no transformation)
			allCards.push(...cards);
			consecutiveFailures = 0; // Reset failure counter on success

			console.log(
				`Fetched ${cards.length} cards (total: ${allCards.length})`,
			);

			// Save incrementally every 100 cards
			if (allCards.length % 100 === 0 || cards.length < pageSize) {
				saveCardsIncremental(allCards);
				console.log(`💾 Saved ${allCards.length} cards to file`);
			}

			// Check if there are more pages
			if (cards.length < pageSize) {
				hasMore = false;
			} else {
				hasMore = response.data.totalCount > allCards.length;
				page++;
			}

			// Small delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 500));
		} catch (error: any) {
			consecutiveFailures++;
			console.error(`Error fetching page ${page}:`, error.message);
			if (error.response) {
				console.error('Response status:', error.response.status);
			}

			if (consecutiveFailures >= maxConsecutiveFailures) {
				console.error(
					`\n❌ Failed ${maxConsecutiveFailures} times in a row. Saving progress and stopping...`,
				);
				saveCardsIncremental(allCards);
				break;
			}

			// Wait before retrying
			const waitTime = 5000 * consecutiveFailures;
			console.log(`Waiting ${waitTime / 1000}s before retrying...`);
			await new Promise((resolve) => setTimeout(resolve, waitTime));
		}
	}

	// Final save
	saveCardsIncremental(allCards);

	console.log(
		`\n✅ Successfully fetched and saved ${allCards.length} cards to ${OUTPUT_FILE}`,
	);
}

parseEnhancedCards().catch(console.error);
