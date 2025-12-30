import { seedUsers } from './seed-user';
import { seedCards } from './seed-cards';
import { seedBinders } from './seed-binders';
import { seedBinderCards } from './seed-binder-cards';

async function run() {
	await seedUsers();
	await seedCards();
	await seedBinders();
	await seedBinderCards();
}

run()
	.then(() => {
		console.log('Seeding complete');
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
