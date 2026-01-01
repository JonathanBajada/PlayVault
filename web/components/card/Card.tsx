'use client';

import { useState, useEffect } from 'react';
import { Card as CardType } from '@/lib/api/cards';

interface CardProps {
	card: CardType;
	onClick?: () => void;
	isInBinder?: boolean;
}

export default function Card({ card, onClick, isInBinder = false }: CardProps) {
	const [added, setAdded] = useState(isInBinder);

	// Log card data when component renders
	useEffect(() => {
		console.log('🃏 Card rendered:', {
			id: card.id,
			name: card.name,
			image_small_url: card.image_small_url || '❌ MISSING',
			hasImage: !!card.image_small_url,
			set_name: card.set_name,
			rarity: card.rarity,
		});
	}, [card]);

	const handleAddToBinder = (e: React.MouseEvent) => {
		e.stopPropagation();
		setAdded(!added);
	};

	const rarityLower = card.rarity?.toLowerCase() || '';
	const isHolo =
		rarityLower.includes('rare holo') || rarityLower.includes('holo');

	// Get rarity label - display actual rarity value in uppercase
	const getRarityLabel = (): string => {
		if (!card.rarity) return 'COMMON';
		return card.rarity.toUpperCase();
	};

	// Get rarity color category for styling
	const getRarityColorCategory = (): 'COMMON' | 'UNCOMMON' | 'RARE' => {
		if (!card.rarity) return 'COMMON';
		const r = card.rarity.toLowerCase();
		if (r === 'common') return 'COMMON';
		if (r === 'uncommon') return 'UNCOMMON';
		// All rare variants (rare, rare holo, ultra, promo, etc.) use RARE colors
		return 'RARE';
	};

	const rarityLabel = getRarityLabel();
	const rarityColorCategory = getRarityColorCategory();

	return (
		<div
			className={`card ${isHolo ? 'holo' : ''} cursor-pointer group`}
			onClick={onClick}
		>
			{/* ================= FULL WIDTH IMAGE ================= */}
			<div
				className='card-image-wrapper'
				style={{
					background:
						rarityColorCategory === 'COMMON'
							? 'rgba(148, 163, 184, 0.18)'
							: rarityColorCategory === 'UNCOMMON'
							? 'rgba(34, 197, 94, 0.18)'
							: 'rgba(245, 158, 11, 0.22)',
				}}
			>
				{/* ================= TOP LEFT RARITY LABEL ================= */}
				<div
					className='rarity-badge'
					style={{
						background: rarityLower.includes('holo')
							? 'var(--rarity-holo)'
							: rarityLower === 'common'
							? 'var(--rarity-common)'
							: rarityLower === 'uncommon'
							? 'var(--rarity-uncommon)'
							: rarityLower === 'rare'
							? 'var(--rarity-rare)'
							: 'var(--rarity-common)',
					}}
				>
					{card.rarity || 'Unknown'}
				</div>

				{card.image_small_url ? (
					<img src={card.image_small_url} alt={card.name} loading='lazy' />
				) : (
					<div
						className='w-full h-full flex items-center justify-center'
						style={{ backgroundColor: 'var(--bg-elevated)' }}
					>
						<div
							style={{ color: 'var(--text-muted)' }}
							className='text-sm'
						>
							No Image
						</div>
					</div>
				)}

				{/* Shiny hover effect */}
				<div
					className='absolute inset-0
						bg-gradient-to-r from-transparent via-white/30 to-transparent
						-translate-x-full group-hover:translate-x-full
						transition-transform duration-1000 pointer-events-none z-10'
				/>
			</div>

			{/* ================= RARITY LABEL BAR ================= */}
			<div
				className='rarity-label-bar'
				style={{
					background:
						rarityColorCategory === 'COMMON'
							? 'rgba(148, 163, 184, 0.12)'
							: rarityColorCategory === 'UNCOMMON'
							? 'rgba(34, 197, 94, 0.12)'
							: 'rgba(245, 158, 11, 0.16)',
					color:
						rarityColorCategory === 'COMMON'
							? '#cbd5e1'
							: rarityColorCategory === 'UNCOMMON'
							? '#86efac'
							: '#fde68a',
				}}
			>
				{rarityLabel}
			</div>

			{/* ================= CONTENT PANEL ================= */}
			<div
				className='flex flex-col'
				style={{
					background: 'rgba(22, 30, 46, 1)',
				}}
			>
				<div className='px-6 pt-7 pb-5 flex-grow'>
					{/* Name and Set Info */}
					<div className='space-y-1.5'>
						<h3 className='card-title line-clamp-2 min-h-[2.5rem]'>
							{card.name}
						</h3>

						{/* Set Info - directly under name */}
						{card.set_name && (
							<div className='space-y-0.5 -mt-0.5'>
								<p className='card-meta-label'>SET</p>
								<p className='card-meta-value line-clamp-1'>
									{card.set_name}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Price Zone */}
				<div
					className='price-zone'
					style={{
						background:
							'linear-gradient(to bottom, rgba(18, 26, 38, 0.4), rgba(15, 22, 35, 0.6))',
					}}
				>
					{/* Price */}
					<div
						className='px-6 pt-6'
						style={{ borderTop: '1px solid var(--border-default)' }}
					>
						<p className='card-meta-label mb-2'>PRICE</p>
						<p className='card-price'>$24.99</p>
					</div>
					{/* Action Buttons */}
					<div className='px-6 pt-6 pb-6 flex gap-2 shrink-0'>
						{/* Favorite Button */}
						<button
							onClick={(e) => {
								e.stopPropagation();
								// TODO: Implement favorite functionality
							}}
							className='btn-secondary p-2.5 flex items-center justify-center'
							aria-label='Favorite card'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='w-5 h-5 text-gray-600 hover:text-yellow-500 transition-colors duration-200'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
								/>
							</svg>
						</button>

						{/* Add to Binder */}
						<button
							onClick={handleAddToBinder}
							aria-pressed={added}
							className={`btn-primary flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm
							${added ? 'opacity-90' : ''}`}
						>
							{added ? (
								<>
									<span>✓</span>
									<span>Binder</span>
								</>
							) : (
								<>
									<span>+</span>
									<span>Binder</span>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
