'use client';

import { useState, useEffect } from 'react';
import { Card as CardType } from '@/lib/api/cards';

interface CardProps {
	card: CardType;
	onClick?: () => void;
	isInBinder?: boolean;
}

function getRarityColors(rarity: string | null | undefined) {
	if (!rarity) {
		return {
			bg: 'bg-slate-500/15',
			text: 'text-slate-700',
			border: 'border-slate-300/50',
			banner: 'bg-slate-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(100,116,139,0.25)]',
		};
	}

	const rarityLower = rarity.toLowerCase();

	// Rare Holo variants (all share purple)
	if (rarityLower.includes('rare holo') || rarityLower === 'rare ultra') {
		return {
			bg: 'bg-purple-500/20',
			text: 'text-purple-700',
			border: 'border-purple-300/50',
			banner: 'bg-purple-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(168,85,247,0.25)]',
		};
	}

	// Specific rarity mappings
	if (rarityLower === 'common') {
		return {
			bg: 'bg-slate-500/15',
			text: 'text-slate-700',
			border: 'border-slate-300/50',
			banner: 'bg-slate-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(100,116,139,0.25)]',
		};
	}

	if (rarityLower === 'uncommon') {
		return {
			bg: 'bg-emerald-500/15',
			text: 'text-emerald-700',
			border: 'border-emerald-300/50',
			banner: 'bg-emerald-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(16,185,129,0.25)]',
		};
	}

	if (rarityLower === 'promo') {
		return {
			bg: 'bg-orange-500/15',
			text: 'text-orange-700',
			border: 'border-orange-300/50',
			banner: 'bg-orange-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(251,146,60,0.25)]',
		};
	}

	if (rarityLower === 'rare') {
		return {
			bg: 'bg-blue-500/15',
			text: 'text-blue-700',
			border: 'border-blue-300/50',
			banner: 'bg-blue-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(37,99,235,0.25)]',
		};
	}

	if (rarityLower === 'rare break') {
		return {
			bg: 'bg-amber-500/20',
			text: 'text-amber-800',
			border: 'border-amber-300/60',
			banner: 'bg-amber-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(245,158,11,0.25)]',
		};
	}

	if (rarityLower === 'rare prism star') {
		return {
			bg: 'bg-cyan-500/15',
			text: 'text-cyan-700',
			border: 'border-cyan-300/50',
			banner: 'bg-cyan-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(6,182,212,0.25)]',
		};
	}

	if (rarityLower === 'rare shiny') {
		return {
			bg: 'bg-teal-500/15',
			text: 'text-teal-700',
			border: 'border-teal-300/50',
			banner: 'bg-teal-600/80',
			shadow: 'shadow-[0_8px_30px_rgba(20,184,166,0.25)]',
		};
	}

	// Default fallback
	return {
		bg: 'bg-slate-500/15',
		text: 'text-slate-700',
		border: 'border-slate-300/50',
		banner: 'bg-slate-600/80',
		shadow: 'shadow-[0_8px_30px_rgba(100,116,139,0.25)]',
	};
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

	const rarityColors = getRarityColors(card.rarity);
	const borderStyle = `border ${rarityColors.border} ${rarityColors.shadow}`;
	const rarityBannerColor = rarityColors.banner;

	return (
		<div
			className={`relative rounded-2xl overflow-hidden ${borderStyle}
				group cursor-pointer transition-all duration-200 ease-out
				group-hover:-translate-y-1
				group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]`}
			onClick={onClick}
		>
			{/* ================= FULL WIDTH IMAGE ================= */}
			<div className='w-full bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden'>
				{/* ================= TOP LEFT RARITY LABEL ================= */}
				<div className='absolute top-2 left-2 z-20'>
					<div
						className={`${rarityBannerColor}
							text-white text-[10px] font-bold tracking-wide
							px-2.5 py-1 rounded-md
							shadow-lg backdrop-blur-sm`}
					>
						{card.rarity || 'Unknown'}
					</div>
				</div>

				{card.image_small_url ? (
					<img
						src={card.image_small_url}
						alt={card.name}
						className='w-full h-auto object-cover'
						loading='lazy'
					/>
				) : (
					<div className='w-full aspect-square flex items-center justify-center bg-gray-200'>
						<div className='text-gray-400 text-sm'>No Image</div>
					</div>
				)}

				{/* Hover shimmer effect */}
				<div
					className='absolute inset-0
						bg-gradient-to-r from-transparent via-white/30 to-transparent
						-translate-x-full group-hover:translate-x-full
						transition-transform duration-1000 pointer-events-none'
				/>
			</div>

			{/* ================= CONTENT PANEL ================= */}
			<div className='bg-white/95 backdrop-blur-sm flex flex-col'>
				<div className='px-4 pt-4 pb-4 flex-grow'>
					{/* Name and Set Info */}
					<div className='space-y-1'>
						<h3 className='font-bold text-gray-900 text-base leading-tight line-clamp-2 min-h-[2.5rem]'>
							{card.name}
						</h3>

						{/* Set Info - directly under name */}
						{card.set_name && (
							<div className='space-y-0.5 -mt-0.5'>
								<p className='text-[10px] text-gray-500 font-semibold uppercase tracking-wider'>
									SET
								</p>
								<p className='text-xs text-gray-700 font-medium line-clamp-1'>
									{card.set_name}
								</p>
							</div>
						)}
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
						className='p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center'
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
						className={`flex-1 flex items-center justify-center gap-1.5
							px-3 py-2.5 text-sm font-semibold rounded-lg
							transition-colors duration-200
							${
								added
									? 'bg-green-500/90 text-white hover:bg-green-600'
									: 'bg-purple-600/80 text-white hover:bg-purple-700'
							}`}
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
