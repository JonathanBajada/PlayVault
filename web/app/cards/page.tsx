'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCards, Card as CardType } from '@/lib/api/cards';
import Card from '@/components/Card';
import CardModal from '@/components/CardModal';

export default function CardsPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
	const limit = 20;

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
			setPage(1); // Reset to first page on new search
		}, 500);

		return () => clearTimeout(timer);
	}, [search]);

	const { data, isLoading, error } = useQuery({
		queryKey: ['cards', page, limit, debouncedSearch],
		queryFn: () =>
			fetchCards({
				page,
				limit,
				search: debouncedSearch || undefined,
			}),
	});

	const totalPages = data ? Math.ceil(data.total / limit) : 0;

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (error) {
		console.error(error);
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
						<p className='text-red-800 dark:text-red-200'>
							Error loading cards. Please try again later.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
						Card Collection
					</h1>
					<p className='text-gray-600 dark:text-gray-400'>
						Browse through your collection of cards
					</p>
				</div>

				{/* Search Bar */}
				<div className='mb-8'>
					<div className='relative max-w-md'>
						<input
							type='text'
							placeholder='Search cards by name...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='w-full px-4 py-3 pl-10 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
						/>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<svg
								className='h-5 w-5 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className='flex justify-center items-center py-20'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
					</div>
				)}

				{/* Cards Grid */}
				{!isLoading && data && (
					<>
						<div className='mb-6 text-sm text-gray-600 dark:text-gray-400'>
							Showing {data.data.length} of {data.total} cards
						</div>
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6'>
							{data.data.map((card) => (
								<Card
									key={card.id}
									card={card}
									onClick={() => setSelectedCard(card)}
								/>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className='mt-12 flex justify-center items-center space-x-2'>
								<button
									onClick={() => handlePageChange(page - 1)}
									disabled={page === 1}
									className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
								>
									Previous
								</button>

								<div className='flex space-x-1'>
									{Array.from(
										{ length: Math.min(5, totalPages) },
										(_, i) => {
											let pageNum;
											if (totalPages <= 5) {
												pageNum = i + 1;
											} else if (page <= 3) {
												pageNum = i + 1;
											} else if (page >= totalPages - 2) {
												pageNum = totalPages - 4 + i;
											} else {
												pageNum = page - 2 + i;
											}

											return (
												<button
													key={pageNum}
													onClick={() => handlePageChange(pageNum)}
													className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
														page === pageNum
															? 'bg-indigo-600 text-white'
															: 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
													}`}
												>
													{pageNum}
												</button>
											);
										},
									)}
								</div>

								<button
									onClick={() => handlePageChange(page + 1)}
									disabled={page === totalPages}
									className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
								>
									Next
								</button>
							</div>
						)}

						{/* Page Info */}
						{totalPages > 1 && (
							<div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
								Page {page} of {totalPages}
							</div>
						)}
					</>
				)}

				{/* Empty State */}
				{!isLoading && data && data.data.length === 0 && (
					<div className='text-center py-20'>
						<p className='text-gray-600 dark:text-gray-400 text-lg'>
							No cards found. Try adjusting your search.
						</p>
					</div>
				)}
			</div>

			{/* Card Modal */}
			<CardModal
				card={selectedCard}
				isOpen={!!selectedCard}
				onClose={() => setSelectedCard(null)}
			/>
		</div>
	);
}
