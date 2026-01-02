export type Card = {
	id: string;
	name: string;
	set_name: string;
	rarity: string | null;
	image_small_url: string;
	image_large_url?: string;
	supertype?: string;
	number?: string;
	hp?: string;
	artist?: string;
};

export type CardDetail = Card & {
	set_series?: string;
	set_release_date?: string;
	types?: string[];
	subtypes?: string[];
	attacks?: {
		name: string;
		cost: string[];
		damage?: string;
		text?: string;
		convertedEnergyCost?: number;
	}[];
	abilities?: {
		name: string;
		text: string;
		type?: string;
	}[];
	weaknesses?: { type: string; value: string }[];
	resistances?: { type: string; value: string }[];
	nationalPokedexNumbers?: number[];
	prices?: {
		source: string;
		variant: string;
		low?: number;
		mid?: number;
		high?: number;
		market?: number;
		direct_low?: number;
		updated_at?: string;
	}[];
};

export type CardsResponse = {
	page: number;
	limit: number;
	total: number;
	data: Card[];
};

export async function fetchCards({
	page,
	limit,
	search,
	rarity,
	set,
	cardType,
	minPrice,
	maxPrice,
	priceSort,
}: {
	page: number;
	limit: number;
	search?: string;
	rarity?: string;
	set?: string;
	cardType?: string;
	minPrice?: string;
	maxPrice?: string;
	priceSort?: string;
}): Promise<CardsResponse> {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});

	if (search) params.set('search', search);
	if (rarity) params.set('rarity', rarity);
	if (set) params.set('set', set);
	if (cardType) params.set('cardType', cardType);
	if (minPrice) params.set('minPrice', minPrice);
	if (maxPrice) params.set('maxPrice', maxPrice);
	if (priceSort) params.set('priceSort', priceSort);

	const res = await fetch(`http://localhost:4000/cards?${params.toString()}`);

	if (!res.ok) {
		throw new Error('Failed to fetch cards');
	}

	const data = await res.json();

	// Log the cards data for debugging
	console.log('📦 Cards API Response:', {
		page: data.page,
		limit: data.limit,
		total: data.total,
		cardsCount: data.data?.length || 0,
	});

	// Log first few cards to see structure
	if (data.data && data.data.length > 0) {
		console.log(
			'🃏 Sample cards (first 3):',
			data.data.slice(0, 3).map((card: Card) => ({
				id: card.id,
				name: card.name,
				image_small_url: card.image_small_url,
				set_name: card.set_name,
				rarity: card.rarity,
			})),
		);
	}

	return data;
}

export async function fetchSets(): Promise<string[]> {
	const res = await fetch('http://localhost:4000/cards/sets');

	if (!res.ok) {
		throw new Error('Failed to fetch sets');
	}

	const data = await res.json();
	return data.sets;
}

export async function fetchRarities(): Promise<string[]> {
	const res = await fetch('http://localhost:4000/cards/rarities');

	if (!res.ok) {
		throw new Error('Failed to fetch rarities');
	}

	const data = await res.json();
	return data.rarities;
}

export async function fetchCardTypes(): Promise<string[]> {
	const res = await fetch('http://localhost:4000/cards/types');

	if (!res.ok) {
		throw new Error('Failed to fetch card types');
	}

	const data = await res.json();
	return data.types;
}

export async function fetchCardById(id: string): Promise<CardDetail> {
	const res = await fetch(`http://localhost:4000/cards/${id}`);

	if (!res.ok) {
		if (res.status === 404) {
			throw new Error('Card not found');
		}
		throw new Error('Failed to fetch card');
	}

	return res.json();
}
