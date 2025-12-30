import { Router } from 'express';
import { getCards, getUniqueSets, getUniqueRarities } from '../repositories/card-repository';

console.log('cards router file loaded');

const router = Router();

router.get('/', async (req, res) => {
	const page = Number(req.query.page ?? 1);
	const limit = Number(req.query.limit ?? 10);

	const search = req.query.search?.toString();
	const rarity = req.query.rarity?.toString();
	const set = req.query.set?.toString();

	const { cards, total } = await getCards(page, limit, {
		search,
		rarity,
		set,
	});

	res.json({
		page,
		limit,
		total,
		data: cards,
	});
});

router.get('/sets', async (req, res) => {
	try {
		const sets = await getUniqueSets();
		res.json({ sets });
	} catch (error) {
		console.error('Error fetching sets:', error);
		res.status(500).json({ error: 'Failed to fetch sets' });
	}
});

router.get('/rarities', async (req, res) => {
	try {
		const rarities = await getUniqueRarities();
		res.json({ rarities });
	} catch (error) {
		console.error('Error fetching rarities:', error);
		res.status(500).json({ error: 'Failed to fetch rarities' });
	}
});

export default router;
