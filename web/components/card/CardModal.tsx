'use client';

import { Card as CardType, CardDetail, fetchCardById } from '@/lib/api/cards';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CardModalProps {
	card: CardType | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function CardModal({ card, isOpen, onClose }: CardModalProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isInBinder, setIsInBinder] = useState(false);

	// Fetch full card details when modal opens
	const {
		data: cardDetail,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['cardDetail', card?.id],
		queryFn: () => fetchCardById(card!.id),
		enabled: isOpen && !!card,
	});

	// Close on Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen || !card) return null;

	const displayCard: CardDetail = cardDetail || card;

	// Get rarity color category
	const getRarityColorCategory = (): 'COMMON' | 'UNCOMMON' | 'RARE' => {
		if (!displayCard.rarity) return 'COMMON';
		const r = displayCard.rarity.toLowerCase();
		if (r === 'common') return 'COMMON';
		if (r === 'uncommon') return 'UNCOMMON';
		return 'RARE';
	};

	const rarityColorCategory = getRarityColorCategory();
	const rarityLower = displayCard.rarity?.toLowerCase() || '';
	const isHolo =
		rarityLower.includes('rare holo') || rarityLower.includes('holo');

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsFavorite(!isFavorite);
	};

	const handleToggleBinder = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsInBinder(!isInBinder);
	};

	return (
		<div
			className='fixed inset-0 z-40 w-full h-full overflow-y-auto'
			style={{
				background: 'rgba(0, 0, 0, 0.95)',
				backdropFilter: 'blur(8px)',
				paddingTop: '4rem', // Account for navbar height (h-16 = 4rem)
			}}
		>
			{/* Main Content Container - Same width as app */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Main Content Container */}
				<div className='min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 pb-24 md:pb-8'>
					{isLoading ? (
						<div className='flex items-center justify-center min-h-[600px]'>
							<div
								className='animate-spin rounded-full h-12 w-12 border-4 border-t-transparent'
								style={{ borderColor: 'var(--text-secondary)' }}
							/>
						</div>
					) : error ? (
						<div className='flex items-center justify-center min-h-[600px]'>
							<p style={{ color: 'var(--text-secondary)' }}>
								Error loading card details
							</p>
						</div>
					) : (
						<div
							className='grid md:grid-cols-2 gap-8 lg:gap-12'
							style={{ gridTemplateColumns: '1fr 1.5fr' }}
						>
							{/* Left Column - Card Image */}
							<div className='relative'>
								{/* Back Button */}
								<button
									onClick={onClose}
									className='flex items-center gap-2 mb-4 text-sm font-medium transition-colors duration-200 hover:opacity-80'
									style={{ color: 'var(--text-secondary)' }}
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
											d='M15 19l-7-7 7-7'
										/>
									</svg>
									<span>Back to Pokedex</span>
								</button>

								<div
									className={`card-detail-image-bg relative rounded-2xl overflow-hidden ${
										isHolo ? 'holo' : ''
									}`}
									data-rarity={rarityColorCategory}
									style={{
										boxShadow: 'var(--shadow-lg)',
										position: 'relative',
									}}
								>
									{/* Gold Radial Glow */}
									<div
										className='absolute inset-0 pointer-events-none'
										style={{
											background:
												'radial-gradient(circle at center, var(--vault-gold-soft) 0%, transparent 70%)',
											opacity: 0.6,
										}}
									/>

									{/* Card Image Wrapper with Holo Shimmer */}
									<div className='card-image-wrapper relative p-3 md:p-12 min-h-[300px] flex items-center justify-center'>
										{displayCard.image_large_url ||
										displayCard.image_small_url ? (
											<img
												src={
													displayCard.image_large_url ||
													displayCard.image_small_url
												}
												alt={displayCard.name}
												className='max-w-full max-h-[70vh] object-contain drop-shadow-2xl relative z-10'
												style={{
													filter:
														'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))',
												}}
											/>
										) : (
											<div
												style={{ color: 'var(--text-muted)' }}
												className='text-lg relative z-10'
											>
												No Image Available
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Right Column - Card Details */}
							<div className='flex flex-col'>
								{/* Elevated Info Panel */}
								<div
									className='rounded-2xl p-5 md:p-6 flex-1'
									style={{
										background: 'var(--bg-elevated)',
										border: '1px solid var(--border-default)',
										boxShadow: 'var(--shadow-md)',
									}}
								>
									{/* Compact Header */}
									<div className='mb-5'>
										<div className='flex items-start justify-between mb-3'>
											<div className='flex-1'>
												<h1
													className='font-brand text-2xl md:text-3xl font-bold mb-1'
													style={{ color: 'var(--text-primary)' }}
												>
													{displayCard.name}
													{displayCard.number && (
														<span
															className='ml-2 text-lg font-normal'
															style={{
																color: 'var(--text-muted)',
															}}
														>
															#{displayCard.number}
														</span>
													)}
												</h1>
												{displayCard.set_name && (
													<p
														className='font-body text-sm'
														style={{
															color: 'var(--text-secondary)',
														}}
													>
														{displayCard.set_name}
														{displayCard.set_series &&
															` • ${displayCard.set_series}`}
													</p>
												)}
											</div>
											{displayCard.rarity && (
												<div
													className='px-3 py-1 rounded-lg text-xs font-semibold'
													style={{
														background:
															rarityColorCategory === 'COMMON'
																? 'rgba(148, 163, 184, 0.3)'
																: rarityColorCategory ===
																  'UNCOMMON'
																? 'rgba(34, 197, 94, 0.3)'
																: 'rgba(245, 158, 11, 0.3)',
														color:
															rarityColorCategory === 'COMMON'
																? '#cbd5e1'
																: rarityColorCategory ===
																  'UNCOMMON'
																? '#86efac'
																: '#fde68a',
														border:
															'1px solid var(--border-default)',
													}}
												>
													{displayCard.rarity.toUpperCase()}
												</div>
											)}
										</div>

										{/* Action Buttons - Desktop */}
										<div className='hidden md:flex gap-2 mb-5'>
											{/* Add to Binder - Primary */}
											<button
												onClick={handleToggleBinder}
												className={`btn-primary flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 ${
													isInBinder ? 'active' : ''
												}`}
												style={{
													background: isInBinder
														? 'linear-gradient(135deg, var(--vault-gold), var(--vault-gold-dark))'
														: 'rgba(199, 179, 119, 0.1)',
													color: isInBinder
														? '#0b0b0d'
														: 'var(--text-secondary)',
													borderColor: isInBinder
														? 'transparent'
														: 'var(--border-default)',
													boxShadow: isInBinder
														? '0 10px 22px rgba(199, 179, 119, 0.35)'
														: 'none',
												}}
											>
												{isInBinder ? (
													<>
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
																d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
															/>
														</svg>
														<span className='font-semibold'>
															In Binder
														</span>
													</>
												) : (
													<>
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
																d='M7 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3Z'
															/>
															<circle
																cx='7'
																cy='8'
																r='1.5'
																fill='currentColor'
															/>
															<circle
																cx='7'
																cy='12'
																r='1.5'
																fill='currentColor'
															/>
															<circle
																cx='7'
																cy='16'
																r='1.5'
																fill='currentColor'
															/>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M10 8H18M10 12H18M10 16H18'
															/>
														</svg>
														<span className='font-semibold'>
															Add to Binder
														</span>
													</>
												)}
											</button>

											{/* Favorite - Secondary */}
											<button
												onClick={handleToggleFavorite}
												className={`btn-secondary flex items-center gap-1.5 px-3 py-2 text-sm transition-all duration-200 ${
													isFavorite ? 'active' : ''
												}`}
												style={{
													background: isFavorite
														? 'rgba(199, 179, 119, 0.15)'
														: 'transparent',
													color: isFavorite
														? 'var(--vault-gold)'
														: 'var(--text-muted)',
													borderColor: isFavorite
														? 'var(--vault-gold-soft)'
														: 'var(--border-default)',
												}}
											>
												<svg
													className='w-4 h-4'
													fill={
														isFavorite ? 'currentColor' : 'none'
													}
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
											</button>
										</div>
									</div>

									{/* Compact Stats Row */}
									<div
										className='flex flex-wrap items-center gap-4 mb-5 pb-4'
										style={{
											borderBottom:
												'1px solid var(--border-default)',
										}}
									>
										{displayCard.supertype && (
											<div className='flex items-center gap-2'>
												<span
													className='text-[10px] font-medium uppercase tracking-wide'
													style={{ color: 'var(--text-muted)' }}
												>
													Type
												</span>
												<span
													className='font-body text-sm font-semibold'
													style={{ color: 'var(--text-primary)' }}
												>
													{displayCard.supertype}
												</span>
											</div>
										)}
										{displayCard.types &&
											displayCard.types.length > 0 && (
												<div className='flex items-center gap-2'>
													<span
														className='text-[10px] font-medium uppercase tracking-wide'
														style={{ color: 'var(--text-muted)' }}
													>
														Types
													</span>
													<div className='flex flex-wrap gap-1.5'>
														{displayCard.types.map(
															(type: string, idx: number) => (
																<span
																	key={idx}
																	className='px-2 py-0.5 rounded text-xs font-medium'
																	style={{
																		background:
																			'rgba(255, 255, 255, 0.08)',
																		border:
																			'1px solid var(--border-default)',
																		color: 'var(--text-primary)',
																	}}
																>
																	{type}
																</span>
															),
														)}
													</div>
												</div>
											)}
										{displayCard.weaknesses &&
											displayCard.weaknesses.length > 0 && (
												<div className='flex items-center gap-2'>
													<span
														className='text-[10px] font-medium uppercase tracking-wide'
														style={{ color: 'var(--text-muted)' }}
													>
														Weakness
													</span>
													<div className='flex flex-wrap gap-1.5'>
														{displayCard.weaknesses.map(
															(
																weakness: {
																	type: string;
																	value: string;
																},
																idx: number,
															) => (
																<span
																	key={idx}
																	className='px-2 py-0.5 rounded text-xs font-medium'
																	style={{
																		background:
																			'rgba(255, 0, 0, 0.15)',
																		border:
																			'1px solid rgba(255, 0, 0, 0.3)',
																		color: '#ef4444',
																	}}
																>
																	{weakness.type}{' '}
																	{weakness.value}
																</span>
															),
														)}
													</div>
												</div>
											)}
										{displayCard.resistances &&
											displayCard.resistances.length > 0 && (
												<div className='flex items-center gap-2'>
													<span
														className='text-[10px] font-medium uppercase tracking-wide'
														style={{ color: 'var(--text-muted)' }}
													>
														Resistance
													</span>
													<div className='flex flex-wrap gap-1.5'>
														{displayCard.resistances.map(
															(
																resistance: {
																	type: string;
																	value: string;
																},
																idx: number,
															) => (
																<span
																	key={idx}
																	className='px-2 py-0.5 rounded text-xs font-medium'
																	style={{
																		background:
																			'rgba(0, 255, 0, 0.15)',
																		border:
																			'1px solid rgba(0, 255, 0, 0.3)',
																		color: '#22c55e',
																	}}
																>
																	{resistance.type}{' '}
																	{resistance.value}
																</span>
															),
														)}
													</div>
												</div>
											)}
									</div>

									{/* Abilities */}
									{displayCard.abilities &&
										displayCard.abilities.length > 0 && (
											<div className='mb-5'>
												<p
													className='text-[10px] font-medium uppercase tracking-wide mb-2'
													style={{ color: 'var(--text-muted)' }}
												>
													Abilities
												</p>
												<div className='space-y-2'>
													{displayCard.abilities.map(
														(
															ability: {
																name: string;
																text: string;
																type?: string;
															},
															idx: number,
														) => (
															<div
																key={idx}
																className='p-3 rounded-lg'
																style={{
																	background:
																		'rgba(255, 255, 255, 0.05)',
																	border:
																		'1px solid var(--border-default)',
																}}
															>
																<p
																	className='font-brand font-semibold mb-1 text-sm'
																	style={{
																		color: 'var(--text-primary)',
																	}}
																>
																	{ability.name}
																</p>
																<p
																	className='font-body text-xs leading-relaxed'
																	style={{
																		color: 'var(--text-secondary)',
																	}}
																>
																	{ability.text}
																</p>
															</div>
														),
													)}
												</div>
											</div>
										)}

									{/* Attacks */}
									{displayCard.attacks &&
										displayCard.attacks.length > 0 && (
											<div className='mb-5'>
												<p
													className='text-[10px] font-medium uppercase tracking-wide mb-2'
													style={{ color: 'var(--text-muted)' }}
												>
													Attacks
												</p>
												<div className='space-y-2'>
													{displayCard.attacks.map(
														(
															attack: {
																name: string;
																cost: string[];
																damage?: string;
																text?: string;
																convertedEnergyCost?: number;
															},
															idx: number,
														) => (
															<div
																key={idx}
																className='p-3 rounded-lg'
																style={{
																	background:
																		'rgba(255, 255, 255, 0.05)',
																	border:
																		'1px solid var(--border-default)',
																}}
															>
																<div className='flex items-start justify-between mb-1.5'>
																	<div className='flex-1'>
																		<p
																			className='font-brand font-semibold mb-1 text-sm'
																			style={{
																				color: 'var(--text-primary)',
																			}}
																		>
																			{attack.name}
																		</p>
																		{attack.cost &&
																			attack.cost.length >
																				0 && (
																				<div className='flex gap-1 items-center'>
																					{attack.cost.map(
																						(
																							energy: string,
																							i: number,
																						) => (
																							<span
																								key={i}
																								className='text-[10px] px-1.5 py-0.5 rounded'
																								style={{
																									background:
																										'rgba(255, 255, 255, 0.1)',
																									color: 'var(--text-secondary)',
																								}}
																							>
																								{energy}
																							</span>
																						),
																					)}
																				</div>
																			)}
																	</div>
																	{attack.damage && (
																		<span
																			className='font-brand text-lg font-bold ml-3'
																			style={{
																				color: 'var(--vault-gold)',
																			}}
																		>
																			{attack.damage}
																		</span>
																	)}
																</div>
																{attack.text && (
																	<p
																		className='font-body text-xs leading-relaxed mt-1.5'
																		style={{
																			color: 'var(--text-secondary)',
																		}}
																	>
																		{attack.text}
																	</p>
																)}
															</div>
														),
													)}
												</div>
											</div>
										)}

									{/* Market Prices - Compact */}
									{displayCard.prices &&
										displayCard.prices.length > 0 && (
											<div className='mb-4'>
												<p
													className='text-[10px] font-medium uppercase tracking-wide mb-2'
													style={{ color: 'var(--text-muted)' }}
												>
													Market Prices
												</p>
												<div
													className='p-4 rounded-lg'
													style={{
														background:
															'rgba(199, 179, 119, 0.08)',
														border:
															'1px solid var(--vault-gold-soft)',
													}}
												>
													<div className='space-y-2'>
														{displayCard.prices.map(
															(
																price: {
																	source: string;
																	variant: string;
																	low?: number;
																	mid?: number;
																	high?: number;
																	market?: number;
																	direct_low?: number;
																	updated_at?: string;
																},
																idx: number,
															) => (
																<div
																	key={idx}
																	className='flex justify-between items-center py-2 px-3 rounded'
																	style={{
																		background:
																			'rgba(0, 0, 0, 0.2)',
																	}}
																>
																	<p
																		className='font-body text-xs font-medium'
																		style={{
																			color: 'var(--text-primary)',
																		}}
																	>
																		{price.source} •{' '}
																		{price.variant}
																	</p>
																	{price.high ? (
																		<span
																			className='font-brand text-lg font-bold'
																			style={{
																				color: 'var(--vault-gold)',
																			}}
																		>
																			$
																			{Number(
																				price.high,
																			).toFixed(2)}
																		</span>
																	) : (
																		<span
																			className='font-brand text-lg font-bold'
																			style={{
																				color: 'var(--text-muted)',
																			}}
																		>
																			N/A
																		</span>
																	)}
																</div>
															),
														)}
													</div>
												</div>
											</div>
										)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Sticky Action Bar */}
			<div
				className='md:hidden fixed bottom-0 left-0 right-0 z-30 p-4 backdrop-blur-md'
				style={{
					background: 'rgba(22, 30, 46, 0.95)',
					borderTop: '1px solid var(--border-default)',
					boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
				}}
			>
				<div className='flex gap-3 max-w-7xl mx-auto'>
					{/* Add to Binder - Primary */}
					<button
						onClick={handleToggleBinder}
						className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
							isInBinder ? 'active' : ''
						}`}
						style={{
							background: isInBinder
								? 'linear-gradient(135deg, var(--vault-gold), var(--vault-gold-dark))'
								: 'rgba(199, 179, 119, 0.1)',
							color: isInBinder ? '#0b0b0d' : 'var(--text-secondary)',
							border: isInBinder
								? 'none'
								: '1px solid var(--border-default)',
							boxShadow: isInBinder
								? '0 10px 22px rgba(199, 179, 119, 0.35)'
								: 'none',
						}}
					>
						{isInBinder ? (
							<>
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
										d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
								<span className='font-semibold'>In Binder</span>
							</>
						) : (
							<>
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
										d='M7 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3Z'
									/>
									<circle cx='7' cy='8' r='1.5' fill='currentColor' />
									<circle cx='7' cy='12' r='1.5' fill='currentColor' />
									<circle cx='7' cy='16' r='1.5' fill='currentColor' />
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M10 8H18M10 12H18M10 16H18'
									/>
								</svg>
								<span className='font-semibold'>Add to Binder</span>
							</>
						)}
					</button>

					{/* Favorite - Secondary */}
					<button
						onClick={handleToggleFavorite}
						className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
							isFavorite ? 'active' : ''
						}`}
						style={{
							background: isFavorite
								? 'rgba(199, 179, 119, 0.15)'
								: 'transparent',
							color: isFavorite
								? 'var(--vault-gold)'
								: 'var(--text-muted)',
							border: `1px solid ${
								isFavorite
									? 'var(--vault-gold-soft)'
									: 'var(--border-default)'
							}`,
						}}
					>
						<svg
							className='w-5 h-5'
							fill={isFavorite ? 'currentColor' : 'none'}
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
					</button>
				</div>
			</div>
		</div>
	);
}
