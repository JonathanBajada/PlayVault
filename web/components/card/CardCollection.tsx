'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	fetchCards,
	fetchSets,
	fetchRarities,
	Card as CardType,
} from '@/lib/api/cards';
import Card from '@/components/card/Card';
import CardModal from '@/components/card/CardModal';

interface CardCollectionProps {
	// Optional props if you want to customize behavior
	initialSearch?: string;
	initialSet?: string;
	limit?: number;
	showHeader?: boolean;
	headerTitle?: string;
	headerDescription?: string;
}

export default function CardCollection({
	initialSearch = '',
	initialSet = '',
	limit = 20,
	showHeader = true,
	headerTitle = 'Card Catalogue',
	headerDescription = 'Explore card sets and build your binder',
}: CardCollectionProps) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState(initialSearch);
	const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
	const [selectedSet, setSelectedSet] = useState<string>(initialSet);
	const [selectedRarity, setSelectedRarity] = useState<string>('');
	const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
			setPage(1); // Reset to first page on new search
		}, 500);

		return () => clearTimeout(timer);
	}, [search]);

	// Reset page when set filter changes
	const handleSetChange = (set: string) => {
		setSelectedSet(set);
		setPage(1);
	};

	// Reset page when rarity filter changes
	const handleRarityChange = (rarity: string) => {
		setSelectedRarity(rarity);
		setPage(1);
	};

	const { data, isLoading, error } = useQuery({
		queryKey: [
			'cards',
			page,
			limit,
			debouncedSearch,
			selectedSet,
			selectedRarity,
		],
		queryFn: () =>
			fetchCards({
				page,
				limit,
				search: debouncedSearch || undefined,
				set: selectedSet || undefined,
				rarity: selectedRarity || undefined,
			}),
	});

	// Fetch all unique sets
	const { data: setsData } = useQuery({
		queryKey: ['sets'],
		queryFn: fetchSets,
	});

	// Fetch all unique rarities
	const { data: raritiesData } = useQuery({
		queryKey: ['rarities'],
		queryFn: fetchRarities,
	});

	const uniqueSets = setsData || [];
	const uniqueRarities = raritiesData || [];

	const totalPages = data ? Math.ceil(data.total / limit) : 0;

	// Log cards data when it changes
	useEffect(() => {
		if (data) {
			console.log('🎴 CardCollection - Cards received:', {
				total: data.total,
				page: data.page,
				limit: data.limit,
				cardsInThisPage: data.data?.length || 0,
			});

			if (data.data && data.data.length > 0) {
				console.log(
					'🃏 All cards in this page:',
					data.data.map((card: CardType) => ({
						id: card.id,
						name: card.name,
						image_small_url: card.image_small_url || 'MISSING',
						hasImage: !!card.image_small_url,
						set_name: card.set_name,
						rarity: card.rarity,
					})),
				);
			}
		}
	}, [data]);

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
		<div
			className='min-h-screen py-8 relative'
			style={{ paddingTop: '3.5rem' }}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
				{/* Header */}
				{showHeader && (
					<div className='mb-12'>
						<h1
							className='font-brand text-4xl md:text-5xl mb-3 drop-shadow-sm'
							style={{
								color: 'var(--text-primary)',
								letterSpacing: '0.3px',
								fontWeight: 600,
								lineHeight: 1.2,
							}}
						>
							{headerTitle}
						</h1>
						<p
							className='font-body text-sm md:text-base'
							style={{
								color: 'var(--text-muted)',
								opacity: 0.65,
								fontWeight: 400,
								lineHeight: 1.5,
							}}
						>
							Explore card sets, build your binder, and connect with
							collectors to trade and sell.
						</p>
					</div>
				)}

				{/* Search and Filter Bar */}
				<div className='mb-14'>
					<div className='filter-container flex flex-col sm:flex-row gap-3 p-4'>
						{/* Search Input */}
						<div className='relative sm:w-64 flex-shrink-0'>
							<input
								type='text'
								placeholder='Search cards by name...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='filter-search-input w-full px-4 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all'
								style={{
									color: 'var(--text-primary)',
									background: 'rgba(255, 255, 255, 0.08)',
									border: '1px solid rgba(255, 255, 255, 0.08)',
								}}
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

						{/* Set Filter */}
						<div className='relative sm:w-56 flex-shrink-0'>
							<select
								value={selectedSet}
								onChange={(e) => handleSetChange(e.target.value)}
								className='filter-dropdown w-full px-4 py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none cursor-pointer'
								style={{
									color: 'var(--text-primary)',
									background: 'rgba(255, 255, 255, 0.04)',
									border: '1px solid rgba(255, 255, 255, 0.08)',
								}}
							>
								<option value=''>All Sets</option>
								{uniqueSets.map((set) => (
									<option key={set} value={set}>
										{set}
									</option>
								))}
							</select>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<svg
									className='h-5 w-5'
									style={{ color: 'var(--text-muted)' }}
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
									/>
								</svg>
							</div>
							<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
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
										d='M19 9l-7 7-7-7'
									/>
								</svg>
							</div>
						</div>

						{/* Rarity Filter */}
						<div className='relative sm:w-56 flex-shrink-0'>
							<select
								value={selectedRarity}
								onChange={(e) => handleRarityChange(e.target.value)}
								className='filter-dropdown w-full px-4 py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none cursor-pointer'
								style={{
									color: 'var(--text-primary)',
									background: 'rgba(255, 255, 255, 0.04)',
									border: '1px solid rgba(255, 255, 255, 0.08)',
								}}
							>
								<option value=''>All Rarities</option>
								{uniqueRarities.map((rarity) => (
									<option key={rarity} value={rarity}>
										{rarity}
									</option>
								))}
							</select>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<svg
									className='h-5 w-5'
									style={{ color: 'var(--text-muted)' }}
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
									/>
								</svg>
							</div>
							<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
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
										d='M19 9l-7 7-7-7'
									/>
								</svg>
							</div>
						</div>

						{/* Clear Filters Button */}
						{(selectedSet || selectedRarity || search) && (
							<button
								onClick={() => {
									setSelectedSet('');
									setSelectedRarity('');
									setSearch('');
								}}
								className='filter-clear-btn px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap'
								style={{
									color: 'var(--text-secondary)',
									background: 'rgba(255, 255, 255, 0.04)',
									border: '1px solid rgba(255, 255, 255, 0.08)',
								}}
							>
								Clear Filters
							</button>
						)}
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className='flex justify-center items-center py-20'>
						<div className='relative'>
							<div
								className='animate-spin rounded-full h-16 w-16 border-4'
								style={{ borderColor: 'var(--border-default)' }}
							></div>
							<div
								className='animate-spin rounded-full h-16 w-16 border-t-4 absolute top-0 left-0'
								style={{ borderColor: 'var(--text-secondary)' }}
							></div>
						</div>
					</div>
				)}

				{/* Cards Grid */}
				{!isLoading && data && (
					<div className='card-grid-zone'>
						<div
							className='mb-10 text-sm'
							style={{ color: 'var(--text-muted)' }}
						>
							Showing {data.data.length} of {data.total} cards
						</div>
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8'>
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
									className='filter-bar px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
									style={{
										color: 'var(--text-secondary)',
										borderColor: 'var(--border-default)',
									}}
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
															? 'filter-bar'
															: 'filter-bar'
													}`}
													style={
														page === pageNum
															? {
																	backgroundColor:
																		'rgba(255, 255, 255, 0.08)',
																	borderColor:
																		'var(--border-strong)',
																	color: 'var(--text-primary)',
															  }
															: undefined
													}
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
									className='filter-bar px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
									style={{
										color: 'var(--text-secondary)',
										borderColor: 'var(--border-default)',
									}}
								>
									Next
								</button>
							</div>
						)}

						{/* Page Info */}
						{totalPages > 1 && (
							<div className='mt-4 text-center text-sm text-gray-600'>
								Page {page} of {totalPages}
							</div>
						)}
					</div>
				)}

				{/* Empty State */}
				{!isLoading && data && data.data.length === 0 && (
					<div className='text-center py-20'>
						<p className='text-gray-600 text-lg'>
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
