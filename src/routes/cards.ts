import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const POKEMON_TCG_BASE_URL = 'https://api.pokemontcg.io/v2';

/**
 * GET /cards/search?q=...
 * Example: /cards/search?q=name:charizard
 *
 * This proxies Pokémon TCG API so your frontend never talks to the 3rd-party API directly.
 */
router.get('/search', async (req: Request, res: Response) => {
	const q = typeof req.query.q === 'string' ? req.query.q : '';

	if (!q || q.trim().length === 0) {
		return res.status(400).json({
			error: "Query param 'q' is required (example: ?q=name:charizard)",
		});
	}

	try {
		const response = await axios.get(`${POKEMON_TCG_BASE_URL}/cards`, {
			params: { q },
			// Optional: if you later add an API key, set it as POKEMON_TCG_API_KEY in your env
			headers: process.env.POKEMON_TCG_API_KEY
				? { 'X-Api-Key': process.env.POKEMON_TCG_API_KEY }
				: undefined,
		});

		return res.status(200).json(response.data);
	} catch (err: any) {
		const status = err?.response?.status ?? 500;
		const message =
			err?.response?.data?.error ??
			err?.message ??
			'Failed to fetch cards from Pokémon TCG API';

		return res.status(status).json({ error: message });
	}
});

export default router;
