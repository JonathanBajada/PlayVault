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
	const [selectedCardType, setSelectedCardType] = useState<string>('');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
	const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [tempFilters, setTempFilters] = useState({
		set: initialSet,
		rarity: '',
		type: '',
		price: [0, 500] as [number, number],
	});

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
	// Handle mobile filter sheet open/close
	useEffect(() => {
		if (mobileFiltersOpen) {
			// Lock body scroll when sheet is open
			document.body.style.overflow = 'hidden';
			// Initialize temp filters with current values
			setTempFilters({
				set: selectedSet,
				rarity: selectedRarity,
				type: selectedCardType,
				price: priceRange,
			});
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [mobileFiltersOpen, selectedSet, selectedRarity, selectedCardType, priceRange]);

	// Apply filters from bottom sheet
	const handleApplyFilters = () => {
		setSelectedSet(tempFilters.set);
		setSelectedRarity(tempFilters.rarity);
		setSelectedCardType(tempFilters.type);
		setPriceRange(tempFilters.price);
		setPage(1);
		setMobileFiltersOpen(false);
	};

	// Clear filters
	const handleClearFilters = () => {
		const cleared = {
			set: '',
			rarity: '',
			type: '',
			price: [0, 500] as [number, number],
		};
		setTempFilters(cleared);
		setSelectedSet(cleared.set);
		setSelectedRarity(cleared.rarity);
		setSelectedCardType(cleared.type);
		setPriceRange(cleared.price);
		setSearch('');
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
				<div className='mb-9'>
					{/* Mobile Layout (≤768px) */}
					<div className='md:hidden flex flex-col gap-3'>
						{/* Full-width Search Input */}
						<div className='relative w-full'>
							<input
								type='text'
								placeholder='Search cards by name...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='filter-search-input w-full px-4 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-base'
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

						{/* Filters Button */}
						<button
							onClick={() => setMobileFiltersOpen(true)}
							className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-base'
							style={{
								color: 'var(--text-primary)',
								background: 'rgba(255, 255, 255, 0.08)',
								border: '1px solid rgba(255, 255, 255, 0.08)',
							}}
						>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
								/>
							</svg>
							Filters
						</button>
					</div>

					{/* Desktop Layout (≥769px) - Unchanged */}
					<div className='hidden md:block'>
						<div className='filter-container flex flex-col gap-3 p-3 sm:p-4'>
						{/* Row 1: Primary Filters - Always on one line */}
						<div className='flex flex-nowrap gap-2 sm:gap-3 overflow-x-auto pb-1'>
							{/* Search Input */}
							<div className='relative flex-1 min-w-0'>
								<input
									type='text'
									placeholder='Search cards by name...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className='filter-search-input w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-sm sm:text-base'
									style={{
										color: 'var(--text-primary)',
										background: 'rgba(255, 255, 255, 0.08)',
										border: '1px solid rgba(255, 255, 255, 0.08)',
									}}
								/>
								<div className='absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none'>
									<svg
										className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400'
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
							<div className='relative w-40 sm:w-48 shrink-0'>
								<select
									value={selectedSet}
									onChange={(e) => handleSetChange(e.target.value)}
									className='filter-dropdown w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none cursor-pointer text-sm sm:text-base'
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
								<div className='absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none'>
									<svg
										className='h-4 w-4 sm:h-5 sm:w-5'
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
								<div className='absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center pointer-events-none'>
									<svg
										className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400'
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
							<div className='relative w-40 sm:w-48 shrink-0'>
								<select
									value={selectedRarity}
									onChange={(e) => handleRarityChange(e.target.value)}
									className='filter-dropdown w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none cursor-pointer text-sm sm:text-base'
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
								<div className='absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none'>
									<svg
										className='h-4 w-4 sm:h-5 sm:w-5'
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
								<div className='absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center pointer-events-none'>
									<svg
										className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400'
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

							{/* Card Type Filter */}
							<div className='relative w-36 sm:w-44 shrink-0'>
								<select
									value={selectedCardType}
									onChange={(e) =>
										handleCardTypeChange(e.target.value)
									}
									className='filter-dropdown w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 pr-9 sm:pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none cursor-pointer text-sm sm:text-base'
									style={{
										color: 'var(--text-primary)',
										background: 'rgba(255, 255, 255, 0.04)',
										border: '1px solid rgba(255, 255, 255, 0.08)',
									}}
								>
									<option value=''>All Types</option>
									<option value='Pokemon'>Pokemon</option>
									<option value='Trainer'>Trainer</option>
									<option value='Energy'>Energy</option>
								</select>
								<div className='absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none'>
									<svg
										className='h-4 w-4 sm:h-5 sm:w-5'
										style={{ color: 'var(--text-muted)' }}
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
										/>
									</svg>
								</div>
								<div className='absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center pointer-events-none'>
									<svg
										className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400'
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
						</div>

						{/* Row 2: Secondary Filters - Price Range Slider */}
						<div className='flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4'>
							{/* Price Range Slider */}
							<div className='w-full sm:w-[65%]'>
								<div className='mb-1'>
									<span
										className='text-[10px] font-medium tracking-wide'
										style={{ color: 'var(--text-secondary)' }}
									>
										Price · ${priceRange[0]} — ${priceRange[1]}
									</span>
								</div>
								<div className='relative h-4'>
									<div className='price-slider-track' />
									<div
										className='price-slider-active-range'
										style={{
											left: `${(priceRange[0] / 500) * 100}%`,
											width: `${
												((priceRange[1] - priceRange[0]) / 500) *
												100
											}%`,
										}}
									/>
									<input
										type='range'
										min='0'
										max='500'
										value={priceRange[0]}
										onChange={(e) =>
											handlePriceRangeChange([
												Math.min(
													Number(e.target.value),
													priceRange[1] - 1,
												),
												priceRange[1],
											])
										}
										className='price-slider-thumb price-slider-thumb-left'
										style={{
											position: 'absolute',
											width: '100%',
											zIndex:
												priceRange[0] > priceRange[1] - 10 ? 2 : 1,
										}}
									/>
									<input
										type='range'
										min='0'
										max='500'
										value={priceRange[1]}
										onChange={(e) =>
											handlePriceRangeChange([
												priceRange[0],
												Math.max(
													Number(e.target.value),
													priceRange[0] + 1,
												),
											])
										}
										className='price-slider-thumb price-slider-thumb-right'
										style={{
											position: 'absolute',
											width: '100%',
											zIndex:
												priceRange[1] < priceRange[0] + 10 ? 2 : 1,
										}}
									/>
								</div>
							</div>

							{/* Clear Filters Button */}
							<button
								onClick={() => {
									setSelectedSet('');
									setSelectedRarity('');
									setSearch('');
									setSelectedCardType('');
									setPriceRange([0, 500]);
								}}
								className='filter-clear-btn px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-opacity duration-200 ease-in-out w-full sm:w-auto'
								style={{
									color: 'var(--text-secondary)',
									background: 'rgba(255, 255, 255, 0.04)',
									border: '1px solid rgba(255, 255, 255, 0.08)',
									opacity:
										selectedSet ||
										selectedRarity ||
										search ||
										selectedCardType ||
										priceRange[0] > 0 ||
										priceRange[1] < 500
											? 1
											: 0,
									pointerEvents:
										selectedSet ||
										selectedRarity ||
										search ||
										selectedCardType ||
										priceRange[0] > 0 ||
										priceRange[1] < 500
											? 'auto'
											: 'none',
								}}
							>
								Clear Filters
							</button>
						</div>
					</div>
				</div>
			</div>

				{/* Mobile Bottom Sheet Modal */}
				{mobileFiltersOpen && (
					<>
						{/* Backdrop */}
						<div
							className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden'
							onClick={() => setMobileFiltersOpen(false)}
							style={{
								animation: 'fadeIn 0.2s ease-out',
							}}
						/>
						{/* Bottom Sheet */}
						<div
							className='fixed bottom-0 left-0 right-0 z-50 md:hidden'
							style={{
								animation: 'slideUp 0.3s ease-out',
							}}
						>
							<div
								className='rounded-t-3xl overflow-hidden'
								style={{
									background: 'rgba(22, 30, 46, 0.98)',
									borderTop: '1px solid rgba(255, 255, 255, 0.1)',
									backdropFilter: 'blur(20px)',
									maxHeight: '85vh',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								{/* Handle Bar */}
								<div className='flex justify-center pt-3 pb-2'>
									<div
										className='w-12 h-1 rounded-full'
										style={{
											background: 'rgba(255, 255, 255, 0.2)',
										}}
									/>
								</div>

								{/* Title */}
								<div className='px-6 pb-4'>
									<h2
										className='text-xl font-semibold'
										style={{ color: 'var(--text-primary)' }}
									>
										Filters
									</h2>
								</div>

								{/* Scrollable Content */}
								<div
									className='overflow-y-auto flex-1 px-6 pb-6'
									style={{
										maxHeight: 'calc(85vh - 180px)',
									}}
								>
									<div className='flex flex-col gap-5'>
										{/* Set Filter */}
										<div>
											<label
												className='block text-sm font-medium mb-2'
												style={{ color: 'var(--text-secondary)' }}
											>
												Set
											</label>
											<div className='relative'>
												<select
													value={tempFilters.set}
													onChange={(e) =>
														setTempFilters({
															...tempFilters,
															set: e.target.value,
														})
													}
													className='w-full px-4 py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none text-base'
													style={{
														color: 'var(--text-primary)',
														background: 'rgba(255, 255, 255, 0.08)',
														border: '1px solid rgba(255, 255, 255, 0.1)',
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
										</div>

										{/* Rarity Filter */}
										<div>
											<label
												className='block text-sm font-medium mb-2'
												style={{ color: 'var(--text-secondary)' }}
											>
												Rarity
											</label>
											<div className='relative'>
												<select
													value={tempFilters.rarity}
													onChange={(e) =>
														setTempFilters({
															...tempFilters,
															rarity: e.target.value,
														})
													}
													className='w-full px-4 py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none text-base'
													style={{
														color: 'var(--text-primary)',
														background: 'rgba(255, 255, 255, 0.08)',
														border: '1px solid rgba(255, 255, 255, 0.1)',
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
										</div>

										{/* Type Filter */}
										<div>
											<label
												className='block text-sm font-medium mb-2'
												style={{ color: 'var(--text-secondary)' }}
											>
												Type
											</label>
											<div className='relative'>
												<select
													value={tempFilters.type}
													onChange={(e) =>
														setTempFilters({
															...tempFilters,
															type: e.target.value,
														})
													}
													className='w-full px-4 py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all appearance-none text-base'
													style={{
														color: 'var(--text-primary)',
														background: 'rgba(255, 255, 255, 0.08)',
														border: '1px solid rgba(255, 255, 255, 0.1)',
													}}
												>
													<option value=''>All Types</option>
													<option value='Pokemon'>Pokemon</option>
													<option value='Trainer'>Trainer</option>
													<option value='Energy'>Energy</option>
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
															d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
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
										</div>

										{/* Price Range Slider */}
										<div>
											<label
												className='block text-sm font-medium mb-3'
												style={{ color: 'var(--text-secondary)' }}
											>
												Price
											</label>
											<div className='mb-2'>
												<span
													className='text-base font-medium'
													style={{ color: 'var(--text-primary)' }}
												>
													${tempFilters.price[0]} — ${tempFilters.price[1]}
												</span>
											</div>
											<div className='relative h-6'>
												<div className='price-slider-track' />
												<div
													className='price-slider-active-range'
													style={{
														left: `${(tempFilters.price[0] / 500) * 100}%`,
														width: `${
															((tempFilters.price[1] - tempFilters.price[0]) /
																500) *
															100
														}%`,
													}}
												/>
												<input
													type='range'
													min='0'
													max='500'
													value={tempFilters.price[0]}
													onChange={(e) =>
														setTempFilters({
															...tempFilters,
															price: [
																Math.min(
																	Number(e.target.value),
																	tempFilters.price[1] - 1,
																),
																tempFilters.price[1],
															],
														})
													}
													className='price-slider-thumb price-slider-thumb-left'
													style={{
														position: 'absolute',
														width: '100%',
														zIndex:
															tempFilters.price[0] >
															tempFilters.price[1] - 10
																? 2
																: 1,
													}}
												/>
												<input
													type='range'
													min='0'
													max='500'
													value={tempFilters.price[1]}
													onChange={(e) =>
														setTempFilters({
															...tempFilters,
															price: [
																tempFilters.price[0],
																Math.max(
																	Number(e.target.value),
																	tempFilters.price[0] + 1,
																),
															],
														})
													}
													className='price-slider-thumb price-slider-thumb-right'
													style={{
														position: 'absolute',
														width: '100%',
														zIndex:
															tempFilters.price[1] <
															tempFilters.price[0] + 10
																? 2
																: 1,
													}}
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Sticky Action Row */}
								<div
									className='px-6 pt-4 pb-6 border-t flex gap-3'
									style={{
										borderColor: 'rgba(255, 255, 255, 0.1)',
										background: 'rgba(22, 30, 46, 0.98)',
									}}
								>
									<button
										onClick={handleClearFilters}
										className='flex-1 px-4 py-3 rounded-xl font-medium text-base transition-all'
										style={{
											color: 'var(--text-secondary)',
											background: 'rgba(255, 255, 255, 0.08)',
											border: '1px solid rgba(255, 255, 255, 0.1)',
										}}
									>
										Clear filters
									</button>
									<button
										onClick={handleApplyFilters}
										className='flex-1 px-4 py-3 rounded-xl font-medium text-base transition-all'
										style={{
											color: 'white',
											background: 'var(--brand-primary)',
											border: '1px solid var(--brand-primary)',
										}}
									>
										Apply filters
									</button>
								</div>
							</div>
						</div>
					</>
				)}


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
