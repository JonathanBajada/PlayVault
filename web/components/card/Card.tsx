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

	return (
		<div
			className={`card ${isHolo ? 'holo' : ''} cursor-pointer`}
			onClick={onClick}
		>
			{/* ================= FULL WIDTH IMAGE ================= */}
			<div className='card-image-wrapper'>
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
			</div>

			{/* ================= CONTENT PANEL ================= */}
			<div
				className='flex flex-col'
				style={{
					background: 'var(--bg-surface-soft)',
					backdropFilter: 'blur(12px)',
				}}
			>
				<div className='px-4 pt-4 pb-4 flex-grow'>
					{/* Name and Set Info */}
					<div className='space-y-1'>
						<h3
							className='card-title line-clamp-2 min-h-[2.5rem]'
							style={{ color: 'var(--text-primary)' }}
						>
							{card.name}
						</h3>

						{/* Set Info - directly under name */}
						{card.set_name && (
							<div className='space-y-0.5 -mt-0.5'>
								<p className='card-meta-label'>SET</p>
								<p
									className='card-meta-value line-clamp-1'
									style={{ color: 'var(--text-secondary)' }}
								>
									{card.set_name}
								</p>
							</div>
						)}
					</div>

					{/* Price */}
					<div
						className='mt-3 pt-3'
						style={{ borderTop: '1px solid var(--border-default)' }}
					>
						<p className='card-meta-label mb-1'>PRICE</p>
						<p
							className='text-lg font-bold'
							style={{ color: 'var(--text-primary)' }}
						>
							$24.99
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='px-4 pb-4 flex gap-2 shrink-0'>
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
	);
}
