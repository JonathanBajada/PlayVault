import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className='bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<Link
							href='/'
							className='text-white text-xl md:text-2xl font-bold hover:text-gray-200 transition-colors'
						>
							🎮 PlayVault
						</Link>
					</div>
					<div className='flex space-x-4 md:space-x-6'>
						<Link
							href='/'
							className='text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors'
						>
							Home
						</Link>
						<Link
							href='/cards'
							className='text-white hover:text-gray-200 px-3 py-2 rounded-lg text-sm md:text-base font-medium transition-colors bg-white/20 hover:bg-white/30'
						>
							Cards
						</Link>
						<Link
							href='/search'
							className='text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors'
						>
							Search
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
