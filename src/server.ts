import express, { Request, Response } from 'express';
import usersRouter from './routes/users';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/users', usersRouter);

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
