'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	fetchCards,
	fetchSets,
	fetchRarities,
	fetchCardTypes,
	Card as CardType,
} from '@/lib/api/cards';
import Card from '@/components/card/Card';
import CardModal from '@/components/card/CardModal';
import FilterSection from '@/components/card/FilterSection';

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
}: CardCollectionProps) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState(initialSearch);
	const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
	const [selectedSet, setSelectedSet] = useState<string>(initialSet);
	const [selectedRarity, setSelectedRarity] = useState<string>('');
	const [selectedCardType, setSelectedCardType] = useState<string>('');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
	const [priceSort, setPriceSort] = useState<string>('');
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

	// Reset page when card type filter changes
	const handleCardTypeChange = (cardType: string) => {
		setSelectedCardType(cardType);
		setPage(1);
	};

	// Reset page when price filter changes
	const handlePriceRangeChange = (newRange: [number, number]) => {
		setPriceRange(newRange);
		setPage(1);
	};

	// Reset page when price sort changes
	const handlePriceSortChange = (sort: string) => {
		setPriceSort(sort);
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
			selectedCardType,
			priceRange,
			priceSort,
		],
		queryFn: () =>
			fetchCards({
				page,
				limit,
				search: debouncedSearch || undefined,
				set: selectedSet || undefined,
				rarity: selectedRarity || undefined,
				cardType: selectedCardType || undefined,
				minPrice: priceRange[0] > 0 ? String(priceRange[0]) : undefined,
				maxPrice: priceRange[1] < 500 ? String(priceRange[1]) : undefined,
				priceSort: priceSort || undefined,
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

	// Fetch all unique card types
	const { data: cardTypesData } = useQuery({
		queryKey: ['cardTypes'],
		queryFn: fetchCardTypes,
	});
	const uniqueSets = setsData || [];
	const uniqueCardTypes = cardTypesData || [];
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
					<div className='mb-16'>
						<h1
							className='font-brand text-4xl md:text-5xl mb-3 drop-shadow-sm'
							style={{
								color: 'var(--vault-gold)',
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
				<FilterSection
					search={search}
					setSearch={setSearch}
					selectedSet={selectedSet}
					handleSetChange={handleSetChange}
					selectedRarity={selectedRarity}
					handleRarityChange={handleRarityChange}
					selectedCardType={selectedCardType}
					handleCardTypeChange={handleCardTypeChange}
					priceRange={priceRange}
					handlePriceRangeChange={handlePriceRangeChange}
					priceSort={priceSort}
					handlePriceSortChange={handlePriceSortChange}
					uniqueSets={uniqueSets}
					uniqueRarities={uniqueRarities}
					uniqueCardTypes={uniqueCardTypes}
				/>

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
