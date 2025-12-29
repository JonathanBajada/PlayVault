import { Router, Request, Response } from 'express';

export type User = {
	id: number;
	name: string;
};

type CreateUserBody = {
	name?: string;
};

type UpdateUserBody = {
	name?: string;
};

// Temporary in-memory data (acts like a database for now)
const users: User[] = [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob' },
];

const router = Router();

// GET /users
router.get('/', (req: Request, res: Response) => {
	return res.status(200).json(users);
});

// POST /users
router.post('/', (req: Request<{}, {}, CreateUserBody>, res: Response) => {
	const name = req.body?.name;

	if (typeof name !== 'string' || name.trim().length === 0) {
		return res.status(400).json({ error: 'Name is required' });
	}

	const newUser: User = {
		id: users.length ? users[users.length - 1].id + 1 : 1,
		name: name.trim(),
	};

	users.push(newUser);

	return res.status(201).json(newUser);
});

// GET /users/:id
router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
	const id = Number(req.params.id);

	const user = users.find((u) => u.id === id);

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	return res.status(200).json(user);
});

// PATCH /users/:id
router.patch(
	'/:id',
	(req: Request<{ id: string }, {}, UpdateUserBody>, res: Response) => {
		const id = Number(req.params.id);

		const user = users.find((u) => u.id === id);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const name = req.body?.name;

		if (name === undefined) {
			return res.status(400).json({ error: 'Nothing to update' });
		}

		if (typeof name !== 'string' || name.trim().length === 0) {
			return res
				.status(400)
				.json({ error: 'Name must be a non-empty string' });
		}

		user.name = name.trim();

		return res.status(200).json(user);
	},
);

// DELETE /users/:id
router.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
	const id = Number(req.params.id);

	const index = users.findIndex((u) => u.id === id);

	if (index === -1) {
		return res.status(404).json({ error: 'User not found' });
	}

	users.splice(index, 1);

	return res.status(204).send();
});

export default router;
