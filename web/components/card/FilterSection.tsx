'use client';

import { useState, useEffect } from 'react';
import {
	HiMagnifyingGlass,
	HiFunnel,
	HiCube,
	HiChevronDown,
	HiStar,
	HiTag,
} from 'react-icons/hi2';

interface FilterSectionProps {
	search: string;
	setSearch: (value: string) => void;
	selectedSet: string;
	handleSetChange: (value: string) => void;
	selectedRarity: string;
	handleRarityChange: (value: string) => void;
	selectedCardType: string;
	handleCardTypeChange: (value: string) => void;
	priceRange: [number, number];
	handlePriceRangeChange: (value: [number, number]) => void;
	uniqueSets: string[];
	uniqueRarities: string[];
}

export default function FilterSection({
	search,
	setSearch,
	selectedSet,
	handleSetChange,
	selectedRarity,
	handleRarityChange,
	selectedCardType,
	handleCardTypeChange,
	priceRange,
	handlePriceRangeChange,
	uniqueSets,
	uniqueRarities,
}: FilterSectionProps) {
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [tempFilters, setTempFilters] = useState({
		set: selectedSet,
		rarity: selectedRarity,
		type: selectedCardType,
		price: priceRange,
	});

	// Handle body scroll lock when mobile filter sheet opens/closes
	useEffect(() => {
		if (mobileFiltersOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [mobileFiltersOpen]);

	// Handle opening mobile filters - initialize temp filters with current values
	const handleOpenMobileFilters = () => {
		setTempFilters({
			set: selectedSet,
			rarity: selectedRarity,
			type: selectedCardType,
			price: priceRange,
		});
		setMobileFiltersOpen(true);
	};

	// Apply filters from bottom sheet
	const handleApplyFilters = () => {
		handleSetChange(tempFilters.set);
		handleRarityChange(tempFilters.rarity);
		handleCardTypeChange(tempFilters.type);
		handlePriceRangeChange(tempFilters.price);
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
		handleSetChange(cleared.set);
		handleRarityChange(cleared.rarity);
		handleCardTypeChange(cleared.type);
		handlePriceRangeChange(cleared.price);
		setSearch('');
	};

	return (
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
						<HiMagnifyingGlass className='h-5 w-5 text-gray-400' />
					</div>
				</div>

				{/* Filters Button */}
				<button
					onClick={handleOpenMobileFilters}
					className='flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all text-base'
					style={{
						color: 'var(--text-primary)',
						background: 'rgba(255, 255, 255, 0.08)',
						border: '1px solid rgba(255, 255, 255, 0.08)',
					}}
				>
					<HiFunnel className='w-5 h-5' />
					Filters
				</button>
			</div>

			{/* Desktop Layout (≥769px) */}
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
								<HiMagnifyingGlass className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400' />
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
								<HiCube
									className='h-4 w-4 sm:h-5 sm:w-5'
									style={{ color: 'var(--text-muted)' }}
								/>
							</div>
							<div className='absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center pointer-events-none'>
								<HiChevronDown className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400' />
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
								<HiStar
									className='h-4 w-4 sm:h-5 sm:w-5'
									style={{ color: 'var(--text-muted)' }}
								/>
							</div>
							<div className='absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center pointer-events-none'>
								<HiChevronDown className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400' />
							</div>
						</div>

						{/* Card Type Filter */}
						<div className='relative w-36 sm:w-44 shrink-0'>
							<select
								value={selectedCardType}
								onChange={(e) => handleCardTypeChange(e.target.value)}
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
								<HiTag
									className='h-4 w-4 sm:h-5 sm:w-5'
									style={{ color: 'var(--text-muted)' }}
								/>
							</div>
							<div className='absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center pointer-events-none'>
								<HiChevronDown className='h-4 w-4 sm:h-5 sm:w-5 text-gray-400' />
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
											((priceRange[1] - priceRange[0]) / 500) * 100
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
							onClick={handleClearFilters}
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
													border:
														'1px solid rgba(255, 255, 255, 0.1)',
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
												<HiCube
													className='h-5 w-5'
													style={{ color: 'var(--text-muted)' }}
												/>
											</div>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<HiChevronDown className='h-5 w-5 text-gray-400' />
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
													border:
														'1px solid rgba(255, 255, 255, 0.1)',
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
												<HiStar
													className='h-5 w-5'
													style={{ color: 'var(--text-muted)' }}
												/>
											</div>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<HiChevronDown className='h-5 w-5 text-gray-400' />
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
													border:
														'1px solid rgba(255, 255, 255, 0.1)',
												}}
											>
												<option value=''>All Types</option>
												<option value='Pokemon'>Pokemon</option>
												<option value='Trainer'>Trainer</option>
												<option value='Energy'>Energy</option>
											</select>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<HiTag
													className='h-5 w-5'
													style={{ color: 'var(--text-muted)' }}
												/>
											</div>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<HiChevronDown className='h-5 w-5 text-gray-400' />
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
												${tempFilters.price[0]} — $
												{tempFilters.price[1]}
											</span>
										</div>
										<div className='relative h-6'>
											<div className='price-slider-track' />
											<div
												className='price-slider-active-range'
												style={{
													left: `${
														(tempFilters.price[0] / 500) * 100
													}%`,
													width: `${
														((tempFilters.price[1] -
															tempFilters.price[0]) /
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
		</div>
	);
}
