'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCards } from '@/lib/api/cards';

export default function CardsPage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['cards', 1],
		queryFn: () =>
			fetchCards({
				page: 1,
				limit: 10,
			}),
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) {
		console.error(error);
		return <p>Error loading cards</p>;
	}

	return (
		<div>
			<h1>Cards</h1>

			<ul>
				{data?.data.map((card) => (
					<li key={card.id}>
						<img src={card.image_small} width={100} />
						<div>{card.name}</div>
						<div>{card.rarity}</div>
					</li>
				))}
			</ul>
		</div>
	);
}
