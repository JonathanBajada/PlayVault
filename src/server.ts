import express, { Request, Response } from 'express';
import 'dotenv/config';
console.log(process.env.POKEMON_TCG_API_KEY);

import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
