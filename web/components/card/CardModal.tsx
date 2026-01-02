import { Card as CardType } from '@/lib/api/cards';
import { useEffect } from 'react';

interface CardModalProps {
	card: CardType | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function CardModal({ card, isOpen, onClose }: CardModalProps) {
	// Close on Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden'; // Prevent background scrolling
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen || !card) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200'
			onClick={onClose}
		>
			{/* Modal Content */}
			<div
				className='relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className='absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-full shadow-lg transition-colors group'
					aria-label='Close modal'
				>
					<svg
						className='w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
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

				{/* Card Image */}
				<div className='flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 min-h-[400px]'>
					{card.image_small_url ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={card.image_small_url}
							alt={card.name}
							className='max-w-full max-h-[70vh] object-contain drop-shadow-2xl'
						/>
					) : (
						<div className='text-gray-400 dark:text-gray-500 text-lg'>
							No Image Available
						</div>
					)}
				</div>

				{/* Card Info */}
				<div className='p-6 border-t border-gray-200 dark:border-gray-700'>
					<h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3'>
						{card.name}
					</h2>
					<div className='flex flex-wrap gap-4'>
						{card.set_name && (
							<div>
								<p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>
									Set
								</p>
								<p className='text-base text-gray-700 dark:text-gray-300 font-medium'>
									{card.set_name}
								</p>
							</div>
						)}
						{card.rarity && (
							<div>
								<p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'>
									Rarity
								</p>
								<span className='inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50'>
									{card.rarity}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
