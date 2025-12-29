import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

type User = {
	id: number;
	name: string;
};

const users: User[] = [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob' },
];

app.get('/health', (req: Request, res: Response) => {
	res.status(200).json({ status: 'ok' });
});

app.get('/users', (req: Request, res: Response) => {
	res.status(200).json(users);
});

type CreateUserBody = {
	name: string;
};

app.post('/users/', (req: Request<{}, {}, CreateUserBody>, res: Response) => {
	const name = req.body.name;

	if (!name || name.trim().length === 0) {
		return res.status(400).json({ error: 'Name is required' });
	}

	const newUser: User = {
		id: users.length ? users[users.length - 1].id + 1 : 1,
		name: name.trim(),
	};

	users.push(newUser);

	res.status(201).json(newUser);
});

app.get('/users/:id', (req: Request, res: Response) => {
	const id = Number(req.params.id);

	const user = users.find((u) => u.id === id);

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	res.status(200).json(user);
});

type UpdateUserBody = {
	name?: string;
};

app.patch(
	'/users/:id',
	(req: Request<{ id: string }, {}, UpdateUserBody>, res: Response) => {
		const id = Number(req.params.id);

		const user = users.find((u) => u.id === id);
		if (!user) {
			return res.status(404).json({ error: 'User does not exist!' });
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

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
