import { Card as CardType } from '@/lib/api/cards';

interface CardProps {
	card: CardType;
	onClick?: () => void;
}

export default function Card({ card, onClick }: CardProps) {
	return (
		<div
			className='bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 group cursor-pointer'
			onClick={onClick}
		>
			{/* Image Container */}
			<div className='aspect-square bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-3 relative overflow-hidden'>
				{card.image_small ? (
					<img
						src={card.image_small}
						alt={card.name}
						className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-105'
						loading='lazy'
					/>
				) : (
					<div className='text-gray-400 dark:text-gray-500 text-sm'>
						No Image
					</div>
				)}
				{/* Decorative corner accent */}
				<div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/20 dark:to-purple-400/20 rounded-bl-full'></div>
			</div>

			{/* Card Info */}
			<div className='p-4 space-y-3'>
				{/* Card Name */}
				<h3 className='font-bold text-gray-900 dark:text-white text-sm md:text-base leading-tight line-clamp-2 min-h-[2.5rem]'>
					{card.name}
				</h3>

				{/* Divider */}
				<div className='h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent'></div>

				{/* Set Name */}
				{card.set_name && (
					<div className='space-y-1'>
						<p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
							Set
						</p>
						<p className='text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium'>
							{card.set_name}
						</p>
					</div>
				)}

				{/* Rarity */}
				{card.rarity && (
					<div className='pt-1'>
						<span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50'>
							{card.rarity}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
