import { Router } from 'express';
import { getCards, getUniqueSets } from '../repositories/card-repository';

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

export default router;
