'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
	HiShoppingBag,
	HiBookOpen,
	HiBars3,
	HiXMark,
	HiArrowRight,
} from 'react-icons/hi2';

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
							className='navbar-logo flex items-center gap-2 text-xl md:text-2xl font-brand hover:opacity-80 transition-opacity'
						>
							<div className='w-6 h-6 md:w-7 md:h-7 relative'>
								<svg
									width='100%'
									height='100%'
									viewBox='0 0 24 24'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									className='navbar-logo-icon'
								>
									<defs>
										<linearGradient
											id='goldGradient'
											x1='0'
											y1='0'
											x2='24'
											y2='24'
										>
											<stop offset='0%' />
											<stop offset='50%' />
											<stop offset='100%' />
										</linearGradient>
									</defs>
									<rect
										x='2.5'
										y='2.5'
										width='19'
										height='19'
										rx='5'
										stroke='url(#goldGradient)'
										strokeWidth='1.5'
									/>
									<path
										d='M8 16V8H11.5C13 8 14 9 14 10.5C14 12 13 13 11.5 13H9.5V16H8Z'
										fill='url(#goldGradient)'
									/>
									<path
										d='M15.5 8H17L14.5 16H13L15.5 8Z'
										fill='url(#goldGradient)'
									/>
								</svg>
							</div>
							<span className='flex items-center gap-2'>
								Poke Vault
								<span
									className='font-japanese text-xs md:text-sm opacity-60'
									style={{ color: 'var(--vault-gold)' }}
								>
									ポケボルト
								</span>
							</span>
						</Link>
					</div>
					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-4 lg:space-x-6'>
						<div className='relative group'>
							<button
								disabled
								className='navbar-link flex items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base font-medium opacity-75 cursor-not-allowed'
							>
								<HiShoppingBag className='w-4 h-4 md:w-5 md:h-5' />
								Marketplace
								<span className='text-xs opacity-75'>Soon</span>
							</button>
							{/* Tooltip */}
							<div className='marketplace-tooltip absolute left-1/2 -translate-x-1/2 top-full mt-3 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50'>
								Peer-to-peer trading & verified listings coming soon
								<div className='marketplace-tooltip-arrow absolute left-1/2 -translate-x-1/2 -top-[6px]'></div>
							</div>
						</div>
						<Link
							href='/'
							className={`navbar-link flex items-center gap-2 px-4 py-2 rounded-xl text-sm lg:text-base font-medium ${
								isActive('/') ? 'navbar-link-active' : ''
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
							<span className='flex items-center gap-1.5'>
								Pokedex
								<span
									className='font-japanese text-[10px] opacity-50'
									style={{ color: 'var(--text-muted)' }}
								>
									図鑑
								</span>
							</span>
						</Link>
						<Link
							href='/binder'
							className={`navbar-link flex items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base font-medium ${
								isActive('/binder') ? 'navbar-link-active' : ''
							}`}
						>
							<HiBookOpen className='w-4 h-4 md:w-5 md:h-5' />
							<span className='flex items-center gap-1.5'>
								My Binder
								<span
									className='font-japanese text-[10px] opacity-50'
									style={{ color: 'var(--text-muted)' }}
								>
									コレクション
								</span>
							</span>
						</Link>
						<Link
							href='/login'
							className='nav-login-premium flex items-center gap-1.5'
							onMouseEnter={(e) => {
								const arrow =
									e.currentTarget.querySelector('.login-arrow');
								if (arrow) {
									(arrow as HTMLElement).style.transform =
										'translateX(2px)';
								}
							}}
							onMouseLeave={(e) => {
								const arrow =
									e.currentTarget.querySelector('.login-arrow');
								if (arrow) {
									(arrow as HTMLElement).style.transform =
										'translateX(0)';
								}
							}}
						>
							<span>Login</span>
							<HiArrowRight className='login-arrow w-4 h-4' />
						</Link>
					</div>

					{/* Mobile Menu Button */}
					<div className='md:hidden flex items-center gap-3'>
						<Link
							href='/login'
							className='nav-login-premium nav-login-premium-mobile flex items-center gap-1.5'
							onMouseEnter={(e) => {
								const arrow =
									e.currentTarget.querySelector('.login-arrow');
								if (arrow) {
									(arrow as HTMLElement).style.transform =
										'translateX(2px)';
								}
							}}
							onMouseLeave={(e) => {
								const arrow =
									e.currentTarget.querySelector('.login-arrow');
								if (arrow) {
									(arrow as HTMLElement).style.transform =
										'translateX(0)';
								}
							}}
						>
							<span>Login</span>
							<HiArrowRight className='login-arrow w-4 h-4' />
						</Link>
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className='navbar-link p-2 rounded-lg'
							aria-label='Toggle menu'
						>
							{!mobileMenuOpen ? (
								<HiBars3 className='w-6 h-6' />
							) : (
								<HiXMark className='w-6 h-6' />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className='md:hidden navbar-mobile-menu'>
						<div className='px-4 py-4 space-y-2'>
							<button
								disabled
								className='navbar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium opacity-75 cursor-not-allowed'
							>
								<HiShoppingBag className='w-5 h-5' />
								Marketplace
								<span className='text-xs opacity-75 ml-auto'>Soon</span>
							</button>
							<Link
								href='/'
								onClick={() => setMobileMenuOpen(false)}
								className={`navbar-link flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
									isActive('/') ? 'navbar-link-active' : ''
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
							<Link
								href='/binder'
								onClick={() => setMobileMenuOpen(false)}
								className={`navbar-link flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
									isActive('/binder') ? 'navbar-link-active' : ''
								}`}
							>
								<HiBookOpen className='w-5 h-5' />
								<span className='flex items-center gap-1.5'>
									My Binder
									<span
										className='font-japanese text-[10px] opacity-50'
										style={{ color: 'var(--text-muted)' }}
									>
										コレクション
									</span>
								</span>
							</Link>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
