export type Card = {
	id: string;
	name: string;
	set_name: string;
	rarity: string | null;
	image_small: string;
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
}: {
	page: number;
	limit: number;
	search?: string;
	rarity?: string;
	set?: string;
}): Promise<CardsResponse> {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});

	if (search) params.set('search', search);
	if (rarity) params.set('rarity', rarity);
	if (set) params.set('set', set);

	const res = await fetch(`http://localhost:4000/cards?${params.toString()}`);

	if (!res.ok) {
		throw new Error('Failed to fetch cards');
	}

	return res.json();
}

export async function fetchSets(): Promise<string[]> {
	const res = await fetch('http://localhost:4000/cards/sets');

	if (!res.ok) {
		throw new Error('Failed to fetch sets');
	}

	const data = await res.json();
	return data.sets;
}
