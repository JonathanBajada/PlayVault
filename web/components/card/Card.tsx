import { Card as CardType } from '@/lib/api/cards';

interface CardProps {
	card: CardType;
	onClick?: () => void;
}

export default function Card({ card, onClick }: CardProps) {
	return (
		<div
			className='card-3d bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 group cursor-pointer relative'
			onClick={onClick}
		>
			{/* Glow effect on hover */}
			<div className='absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 rounded-2xl pointer-events-none' />

			{/* Image Container */}
			<div className='aspect-square bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 flex items-center justify-center p-3 relative overflow-hidden'>
				{card.image_small ? (
					<img
						src={card.image_small}
						alt={card.name}
						className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-105'
						loading='lazy'
					/>
				) : (
					<div className='text-gray-400 dark:text-gray-500 text-sm'>
						No Image
					</div>
				)}
				{/* Animated gradient overlay */}
				<div className='absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-500/5 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
				{/* Shimmer effect on hover */}
				<div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
			</div>

			{/* Card Info */}
			<div className='p-4 space-y-3 relative z-10'>
				{/* Card Name */}
				<h3 className='font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-sm md:text-base leading-tight line-clamp-2 min-h-[2.5rem] group-hover:from-indigo-600 group-hover:to-purple-600 dark:group-hover:from-indigo-400 dark:group-hover:to-purple-400 transition-all duration-300'>
					{card.name}
				</h3>

				{/* Divider */}
				<div className='h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800 to-transparent group-hover:via-indigo-400 dark:group-hover:via-indigo-500 transition-colors duration-300'></div>

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
						<span className='inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 dark:from-purple-400/30 dark:via-indigo-400/30 dark:to-pink-400/30 text-purple-700 dark:text-purple-200 border border-purple-300/50 dark:border-purple-500/50 backdrop-blur-sm shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300'>
							{card.rarity}
						</span>
					</div>
				)}

				{/* Add to Binder Button */}
				<button
					onClick={(e) => {
						e.stopPropagation(); // Prevent card click from firing
						// TODO: Add functionality
					}}
					className='w-full mt-3 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-400 dark:hover:to-purple-400 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
				>
					<svg
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-4 h-4'
					>
						<path
							d='M7 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3Z'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<circle cx='7' cy='8' r='1.5' fill='currentColor' />
						<circle cx='7' cy='12' r='1.5' fill='currentColor' />
						<circle cx='7' cy='16' r='1.5' fill='currentColor' />
						<path
							d='M5.5 8C5.5 7.17157 6.17157 6.5 7 6.5C7.82843 6.5 8.5 7.17157 8.5 8V8'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
						/>
						<path
							d='M5.5 12C5.5 11.1716 6.17157 10.5 7 10.5C7.82843 10.5 8.5 11.1716 8.5 12V12'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
						/>
						<path
							d='M5.5 16C5.5 15.1716 6.17157 14.5 7 14.5C7.82843 14.5 8.5 15.1716 8.5 16V16'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
						/>
					</svg>
					Add to Binder
				</button>
			</div>
		</div>
	);
}
