import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	// Zod validation errors
	if (err instanceof ZodError) {
		return res.status(400).json({
			error: 'Validation error',
			issues: err.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	// Generic errors
	if (err instanceof Error) {
		return res.status(500).json({
			error: 'Internal server error',
			message: err.message,
		});
	}

	return res.status(500).json({ error: 'Internal server error' });
}
