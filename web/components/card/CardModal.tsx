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
	const [cardDetail, setCardDetail] = useState<CardDetail | null>(null);

	// Fetch full card details when modal opens
	const { data, isLoading, error } = useQuery({
		queryKey: ['cardDetail', card?.id],
		queryFn: () => fetchCardById(card!.id),
		enabled: isOpen && !!card,
	});

	useEffect(() => {
		if (data) {
			setCardDetail(data);
		}
	}, [data]);

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

	const displayCard = cardDetail || card;
	const rarityLower = displayCard.rarity?.toLowerCase() || '';
	const isHolo =
		rarityLower.includes('rare holo') || rarityLower.includes('holo');

	// Get rarity color category
	const getRarityColorCategory = (): 'COMMON' | 'UNCOMMON' | 'RARE' => {
		if (!displayCard.rarity) return 'COMMON';
		const r = displayCard.rarity.toLowerCase();
		if (r === 'common') return 'COMMON';
		if (r === 'uncommon') return 'UNCOMMON';
		return 'RARE';
	};

	const rarityColorCategory = getRarityColorCategory();

	return (
		<div
			className='fixed inset-0 z-50 w-full h-full'
			style={{
				background: 'rgba(0, 0, 0, 0.95)',
				backdropFilter: 'blur(8px)',
			}}
		>
			{/* Modal Content - Full Screen */}
			<div
				className='relative w-full h-full overflow-hidden'
				style={{
					background: 'rgba(22, 30, 46, 0.98)',
				}}
			>
				{/* Header with Back and Close Buttons */}
				<div className='absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 md:p-6'>
					{/* Back Button */}
					<button
						onClick={onClose}
						className='p-3 rounded-full transition-all hover:bg-white/10 flex items-center gap-2'
						style={{
							background: 'rgba(255, 255, 255, 0.1)',
							backdropFilter: 'blur(10px)',
						}}
						aria-label='Go back'
					>
						<svg
							className='w-6 h-6'
							style={{ color: 'var(--text-primary)' }}
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
						<span
							className='hidden sm:inline text-sm font-medium'
							style={{ color: 'var(--text-primary)' }}
						>
							Back
						</span>
					</button>

					{/* Close Button */}
					<button
						onClick={onClose}
						className='p-3 rounded-full transition-all hover:bg-white/10'
						style={{
							background: 'rgba(255, 255, 255, 0.1)',
							backdropFilter: 'blur(10px)',
						}}
						aria-label='Close modal'
					>
						<svg
							className='w-6 h-6'
							style={{ color: 'var(--text-primary)' }}
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				{isLoading ? (
					<div className='flex items-center justify-center w-full h-full'>
						<div className='animate-spin rounded-full h-12 w-12 border-4 border-t-transparent'
							style={{ borderColor: 'var(--text-secondary)' }}
						/>
					</div>
				) : error ? (
					<div className='flex items-center justify-center w-full h-full'>
						<p style={{ color: 'var(--text-secondary)' }}>
							Error loading card details
						</p>
					</div>
				) : (
					<div className='grid md:grid-cols-2 gap-0 w-full h-full pt-20 md:pt-24 overflow-y-auto'>
						{/* Left Side - Card Image */}
						<div
							className='relative flex items-center justify-center p-8 md:p-12 h-full min-h-[calc(100vh-6rem)]'
							style={{
								background:
									rarityColorCategory === 'COMMON'
										? 'rgba(148, 163, 184, 0.18)'
										: rarityColorCategory === 'UNCOMMON'
										? 'rgba(34, 197, 94, 0.18)'
										: 'rgba(245, 158, 11, 0.22)',
							}}
						>
							{displayCard.image_large_url || displayCard.image_small_url ? (
								<img
									src={displayCard.image_large_url || displayCard.image_small_url}
									alt={displayCard.name}
									className='max-w-full max-h-[80vh] object-contain drop-shadow-2xl'
								/>
							) : (
								<div
									style={{ color: 'var(--text-muted)' }}
									className='text-lg'
								>
									No Image Available
								</div>
							)}
						</div>

						{/* Right Side - Card Details */}
						<div className='p-8 md:p-10 overflow-y-auto'>
							{/* Header */}
							<div className='mb-6'>
								<h2
									className='text-3xl md:text-4xl font-bold mb-2'
									style={{ color: 'var(--text-primary)' }}
								>
									{displayCard.name}
								</h2>
								{displayCard.set_name && (
									<p
										className='text-lg mb-4'
										style={{ color: 'var(--text-secondary)' }}
									>
										{displayCard.set_name}
										{displayCard.set_series && ` • ${displayCard.set_series}`}
									</p>
								)}
							</div>

							{/* Basic Info Grid */}
							<div className='grid grid-cols-2 gap-4 mb-6'>
								{displayCard.rarity && (
									<div>
										<p
											className='text-xs font-medium uppercase tracking-wide mb-2'
											style={{ color: 'var(--text-muted)' }}
										>
											Rarity
										</p>
										<div
											className='px-3 py-1.5 rounded-lg inline-block text-sm font-semibold'
											style={{
												background:
													rarityColorCategory === 'COMMON'
														? 'rgba(148, 163, 184, 0.3)'
														: rarityColorCategory === 'UNCOMMON'
														? 'rgba(34, 197, 94, 0.3)'
														: 'rgba(245, 158, 11, 0.3)',
												color:
													rarityColorCategory === 'COMMON'
														? '#cbd5e1'
														: rarityColorCategory === 'UNCOMMON'
														? '#86efac'
														: '#fde68a',
											}}
										>
											{displayCard.rarity.toUpperCase()}
										</div>
									</div>
								)}
								{displayCard.number && (
									<div>
										<p
											className='text-xs font-medium uppercase tracking-wide mb-2'
											style={{ color: 'var(--text-muted)' }}
										>
											Number
										</p>
										<p
											className='text-base font-medium'
											style={{ color: 'var(--text-primary)' }}
										>
											#{displayCard.number}
										</p>
									</div>
								)}
								{displayCard.hp && (
									<div>
										<p
											className='text-xs font-medium uppercase tracking-wide mb-2'
											style={{ color: 'var(--text-muted)' }}
										>
											HP
										</p>
										<p
											className='text-base font-medium'
											style={{ color: 'var(--text-primary)' }}
										>
											{displayCard.hp}
										</p>
									</div>
								)}
								{displayCard.supertype && (
									<div>
										<p
											className='text-xs font-medium uppercase tracking-wide mb-2'
											style={{ color: 'var(--text-muted)' }}
										>
											Type
										</p>
										<p
											className='text-base font-medium'
											style={{ color: 'var(--text-primary)' }}
										>
											{displayCard.supertype}
										</p>
									</div>
								)}
							</div>

							{/* Types */}
							{displayCard.types && displayCard.types.length > 0 && (
								<div className='mb-6'>
									<p
										className='text-xs font-medium uppercase tracking-wide mb-2'
										style={{ color: 'var(--text-muted)' }}
									>
										Types
									</p>
									<div className='flex flex-wrap gap-2'>
										{displayCard.types.map((type, idx) => (
											<span
												key={idx}
												className='px-3 py-1 rounded-lg text-sm font-medium'
												style={{
													background: 'rgba(255, 255, 255, 0.1)',
													color: 'var(--text-primary)',
												}}
											>
												{type}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Abilities */}
							{displayCard.abilities && displayCard.abilities.length > 0 && (
								<div className='mb-6'>
									<p
										className='text-xs font-medium uppercase tracking-wide mb-3'
										style={{ color: 'var(--text-muted)' }}
									>
										Abilities
									</p>
									{displayCard.abilities.map((ability, idx) => (
										<div
											key={idx}
											className='mb-3 p-4 rounded-lg'
											style={{
												background: 'rgba(255, 255, 255, 0.05)',
												border: '1px solid rgba(255, 255, 255, 0.1)',
											}}
										>
											<p
												className='font-semibold mb-1'
												style={{ color: 'var(--text-primary)' }}
											>
												{ability.name}
											</p>
											<p
												className='text-sm'
												style={{ color: 'var(--text-secondary)' }}
											>
												{ability.text}
											</p>
										</div>
									))}
								</div>
							)}

							{/* Attacks */}
							{displayCard.attacks && displayCard.attacks.length > 0 && (
								<div className='mb-6'>
									<p
										className='text-xs font-medium uppercase tracking-wide mb-3'
										style={{ color: 'var(--text-muted)' }}
									>
										Attacks
									</p>
									{displayCard.attacks.map((attack, idx) => (
										<div
											key={idx}
											className='mb-3 p-4 rounded-lg'
											style={{
												background: 'rgba(255, 255, 255, 0.05)',
												border: '1px solid rgba(255, 255, 255, 0.1)',
											}}
										>
											<div className='flex items-center gap-3 mb-2'>
												<p
													className='font-semibold'
													style={{ color: 'var(--text-primary)' }}
												>
													{attack.name}
												</p>
												{attack.cost && attack.cost.length > 0 && (
													<div className='flex gap-1'>
														{attack.cost.map((energy, i) => (
															<span
																key={i}
																className='text-xs'
																style={{ color: 'var(--text-muted)' }}
															>
																{energy}
															</span>
														))}
													</div>
												)}
												{attack.damage && (
													<span
														className='ml-auto font-bold'
														style={{ color: 'var(--text-primary)' }}
													>
														{attack.damage}
													</span>
												)}
											</div>
											{attack.text && (
												<p
													className='text-sm'
													style={{ color: 'var(--text-secondary)' }}
												>
													{attack.text}
												</p>
											)}
										</div>
									))}
								</div>
							)}

							{/* Weaknesses & Resistances */}
							{(displayCard.weaknesses ||
								displayCard.resistances) && (
								<div className='grid grid-cols-2 gap-4 mb-6'>
									{displayCard.weaknesses &&
										displayCard.weaknesses.length > 0 && (
											<div>
												<p
													className='text-xs font-medium uppercase tracking-wide mb-2'
													style={{ color: 'var(--text-muted)' }}
												>
													Weaknesses
												</p>
												{displayCard.weaknesses.map((weakness, idx) => (
													<p
														key={idx}
														className='text-sm'
														style={{ color: 'var(--text-primary)' }}
													>
														{weakness.type} {weakness.value}
													</p>
												))}
											</div>
										)}
									{displayCard.resistances &&
										displayCard.resistances.length > 0 && (
											<div>
												<p
													className='text-xs font-medium uppercase tracking-wide mb-2'
													style={{ color: 'var(--text-muted)' }}
												>
													Resistances
												</p>
												{displayCard.resistances.map((resistance, idx) => (
													<p
														key={idx}
														className='text-sm'
														style={{ color: 'var(--text-primary)' }}
													>
														{resistance.type} {resistance.value}
													</p>
												))}
											</div>
										)}
								</div>
							)}

							{/* Prices */}
							{displayCard.prices && displayCard.prices.length > 0 && (
								<div className='mb-6'>
									<p
										className='text-xs font-medium uppercase tracking-wide mb-3'
										style={{ color: 'var(--text-muted)' }}
									>
										Prices
									</p>
									<div className='space-y-2'>
										{displayCard.prices.map((price, idx) => (
											<div
												key={idx}
												className='p-3 rounded-lg'
												style={{
													background: 'rgba(255, 255, 255, 0.05)',
													border: '1px solid rgba(255, 255, 255, 0.1)',
												}}
											>
												<div className='flex justify-between items-center'>
													<div>
														<p
															className='text-sm font-medium'
															style={{ color: 'var(--text-primary)' }}
														>
															{price.source} • {price.variant}
														</p>
													</div>
													{price.high && (
														<p
															className='text-lg font-bold'
															style={{ color: 'var(--vault-gold)' }}
														>
															${Number(price.high).toFixed(2)}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Artist */}
							{displayCard.artist && (
								<div>
									<p
										className='text-xs font-medium uppercase tracking-wide mb-1'
										style={{ color: 'var(--text-muted)' }}
									>
										Artist
									</p>
									<p
										className='text-sm'
										style={{ color: 'var(--text-secondary)' }}
									>
										{displayCard.artist}
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
