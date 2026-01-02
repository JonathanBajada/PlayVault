import { Router } from 'express';
import {
	getCards,
	getUniqueSets,
	getUniqueRarities,
	getUniqueCardTypes,
	getCardById,
} from '../repositories/card-repository';

console.log('cards router file loaded');

const router = Router();

router.get('/', async (req, res) => {
	try {
		const page = Number(req.query.page ?? 1);
		const limit = Number(req.query.limit ?? 10);

		const search = req.query.search?.toString();
		const rarity = req.query.rarity?.toString();
		const set = req.query.set?.toString();
		const cardType = req.query.cardType?.toString();

		const { cards, total } = await getCards(page, limit, {
			search,
			rarity,
			set,
			cardType,
		});

		res.json({
			page,
			limit,
			total,
			data: cards,
		});
	} catch (error) {
		console.error('Error fetching cards:', error);
		res.status(500).json({ error: 'Failed to fetch cards' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const card = await getCardById(id);

		if (!card) {
			return res.status(404).json({ error: 'Card not found' });
		}

		res.json(card);
	} catch (error) {
		console.error('Error fetching card:', error);
		res.status(500).json({ error: 'Failed to fetch card' });
	}
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

router.get('/types', async (req, res) => {
	try {
		const types = await getUniqueCardTypes();
		res.json({ types });
	} catch (error) {
		console.error('Error fetching card types:', error);
		res.status(500).json({ error: 'Failed to fetch card types' });
	}
});

export default router;
