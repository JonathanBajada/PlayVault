'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const isActive = (path: string) => {
		if (path === '/') {
			return pathname === '/';
		}
		return pathname.startsWith(path);
	};

	return (
		<nav className='navbar fixed top-0 left-0 right-0 z-50 shadow-2xl'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<Link
							href='/'
							className='flex items-center gap-2 text-white text-xl md:text-2xl font-bold hover:text-gray-200 transition-colors'
						>
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='w-6 h-6 md:w-7 md:h-7'
							>
								<circle
									cx='12'
									cy='12'
									r='10'
									stroke='#1F2937'
									strokeWidth='2'
									fill='white'
								/>
								<path
									d='M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12H2Z'
									fill='#EF4444'
								/>
								<line
									x1='2'
									y1='12'
									x2='22'
									y2='12'
									stroke='#1F2937'
									strokeWidth='2'
								/>
								<circle cx='12' cy='12' r='3' fill='#1F2937' />
								<circle cx='12' cy='12' r='1.5' fill='white' />
							</svg>
							PokeVault
						</Link>
					</div>
					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-4 lg:space-x-6'>
						<Link
							href='/'
							className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 ${
								isActive('/')
									? 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg'
									: 'text-white/90 hover:text-white hover:bg-white/10'
							}`}
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='w-4 h-4 md:w-5 md:h-5'
							>
								{/* Pokedex device body */}
								<path
									d='M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								{/* Screen area */}
								<path
									d='M6 6H18V14H6V6Z'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									fill='none'
								/>
								{/* Screen glow */}
								<path
									d='M7 7H17V13H7V7Z'
									fill='currentColor'
									opacity='0.2'
								/>
								{/* Buttons */}
								<circle cx='9' cy='17' r='1' fill='currentColor' />
								<circle cx='12' cy='17' r='1' fill='currentColor' />
								<circle cx='15' cy='17' r='1' fill='currentColor' />
							</svg>
							Pokedex
						</Link>
						<button
							onClick={() => alert('Coming Soon!')}
							title='Coming Soon'
							className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all duration-300 text-white/90 hover:text-white hover:bg-white/10 cursor-pointer opacity-75 hover:opacity-100'
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='w-4 h-4 md:w-5 md:h-5'
							>
								{/* Shopping bag */}
								<path
									d='M6 2L3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6L18 2H6Z'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M3 6H21'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							Marketplace
							<span className='text-xs opacity-75'>Soon</span>
						</button>
						<Link
							href='/binder'
							className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base font-medium transition-all duration-300 ${
								isActive('/binder')
									? 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg'
									: 'text-white/90 hover:text-white hover:bg-white/10'
							}`}
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='w-4 h-4 md:w-5 md:h-5'
							>
								{/* Binder cover */}
								<path
									d='M7 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3Z'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								{/* Binding rings */}
								<circle cx='7' cy='8' r='1.5' fill='currentColor' />
								<circle cx='7' cy='12' r='1.5' fill='currentColor' />
								<circle cx='7' cy='16' r='1.5' fill='currentColor' />
								{/* Ring arcs */}
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
								{/* Page lines */}
								<path
									d='M10 8H18'
									stroke='currentColor'
									strokeWidth='1.5'
									strokeLinecap='round'
									opacity='0.7'
								/>
								<path
									d='M10 12H18'
									stroke='currentColor'
									strokeWidth='1.5'
									strokeLinecap='round'
									opacity='0.7'
								/>
								<path
									d='M10 16H18'
									stroke='currentColor'
									strokeWidth='1.5'
									strokeLinecap='round'
									opacity='0.7'
								/>
							</svg>
							My Binder
						</Link>
						<Link
							href='/login'
							className='nav-login-premium flex items-center gap-1.5'
							style={{
								background: 'rgba(255, 255, 255, 0.06)',
								border: '1px solid rgba(255, 255, 255, 0.12)',
								borderRadius: '999px',
								padding: '8px 14px',
								color: '#f8fafc',
								fontWeight: 500,
								fontSize: '0.875rem',
								transition: 'all 150ms ease',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background =
									'rgba(255, 255, 255, 0.12)';
								e.currentTarget.style.borderColor =
									'rgba(255, 255, 255, 0.2)';
								const arrow =
									e.currentTarget.querySelector('.login-arrow');
								if (arrow) {
									(arrow as HTMLElement).style.transform =
										'translateX(2px)';
								}
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background =
									'rgba(255, 255, 255, 0.06)';
								e.currentTarget.style.borderColor =
									'rgba(255, 255, 255, 0.12)';
								const arrow =
									e.currentTarget.querySelector('.login-arrow');
								if (arrow) {
									(arrow as HTMLElement).style.transform =
										'translateX(0)';
								}
							}}
						>
							<span>Login</span>
							<span
								className='login-arrow'
								style={{
									transition: 'transform 150ms ease',
									display: 'inline-block',
								}}
							>
								→
							</span>
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<div className='md:hidden flex items-center gap-3'>
						<Link
							href='/login'
							className='nav-login-premium flex items-center gap-1.5'
							style={{
								background: 'rgba(255, 255, 255, 0.06)',
								border: '1px solid rgba(255, 255, 255, 0.12)',
								borderRadius: '999px',
								padding: '8px 14px',
								color: '#f8fafc',
								fontWeight: 500,
								fontSize: '0.75rem',
								transition: 'all 150ms ease',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background =
									'rgba(255, 255, 255, 0.12)';
								e.currentTarget.style.borderColor =
									'rgba(255, 255, 255, 0.2)';
								const arrow =
									e.currentTarget.querySelector('.login-arrow');
								if (arrow) {
									(arrow as HTMLElement).style.transform =
										'translateX(2px)';
								}
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background =
									'rgba(255, 255, 255, 0.06)';
								e.currentTarget.style.borderColor =
									'rgba(255, 255, 255, 0.12)';
								const arrow =
									e.currentTarget.querySelector('.login-arrow');
								if (arrow) {
									(arrow as HTMLElement).style.transform =
										'translateX(0)';
								}
							}}
						>
							<span>Login</span>
							<span
								className='login-arrow'
								style={{
									transition: 'transform 150ms ease',
									display: 'inline-block',
								}}
							>
								→
							</span>
						</Link>
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className='p-2 text-white hover:bg-white/10 rounded-lg transition-colors'
							aria-label='Toggle menu'
						>
							{!mobileMenuOpen ? (
								<svg
									className='w-6 h-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 6h16M4 12h16M4 18h16'
									/>
								</svg>
							) : (
								<svg
									className='w-6 h-6'
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
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className='md:hidden border-t border-white/10'>
						<div className='px-4 py-4 space-y-2'>
							<Link
								href='/'
								onClick={() => setMobileMenuOpen(false)}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
									isActive('/')
										? 'text-white bg-white/20 backdrop-blur-sm shadow-lg'
										: 'text-white/90 hover:bg-white/10'
								}`}
							>
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									className='w-5 h-5'
								>
									<path
										d='M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M6 6H18V14H6V6Z'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										fill='none'
									/>
									<path
										d='M7 7H17V13H7V7Z'
										fill='currentColor'
										opacity='0.2'
									/>
									<circle cx='9' cy='17' r='1' fill='currentColor' />
									<circle cx='12' cy='17' r='1' fill='currentColor' />
									<circle cx='15' cy='17' r='1' fill='currentColor' />
								</svg>
								Pokedex
							</Link>
							<button
								onClick={() => {
									setMobileMenuOpen(false);
									alert('Coming Soon!');
								}}
								className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 text-white/75 hover:bg-white/10 opacity-75'
							>
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									className='w-5 h-5'
								>
									<path
										d='M6 2L3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6L18 2H6Z'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M3 6H21'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
								Marketplace
								<span className='text-xs opacity-75 ml-auto'>Soon</span>
							</button>
							<Link
								href='/binder'
								onClick={() => setMobileMenuOpen(false)}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
									isActive('/binder')
										? 'text-white bg-white/20 backdrop-blur-sm shadow-lg'
										: 'text-white/90 hover:bg-white/10'
								}`}
							>
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									className='w-5 h-5'
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
									<path
										d='M10 8H18'
										stroke='currentColor'
										strokeWidth='1.5'
										strokeLinecap='round'
										opacity='0.7'
									/>
									<path
										d='M10 12H18'
										stroke='currentColor'
										strokeWidth='1.5'
										strokeLinecap='round'
										opacity='0.7'
									/>
									<path
										d='M10 16H18'
										stroke='currentColor'
										strokeWidth='1.5'
										strokeLinecap='round'
										opacity='0.7'
									/>
								</svg>
								My Binder
							</Link>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
